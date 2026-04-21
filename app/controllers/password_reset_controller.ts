import type { HttpContext } from '@adonisjs/core/http'
import { randomInt } from 'node:crypto'
import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import mail from '@adonisjs/mail/services/main'
import logger from '@adonisjs/core/services/logger'
import User from '#models/user'
import PasswordResetToken from '#models/password_reset_token'
import {
  forgotPasswordValidator,
  verifyResetCodeValidator,
  resetPasswordValidator,
} from '#validators/auth'

export default class PasswordResetController {
  /**
   * Send a 6-digit OTP code to the user's email.
   * Always returns 200 to prevent email enumeration.
   */
  async forgotPassword({ request, response }: HttpContext) {
    const { email } = await request.validateUsing(forgotPasswordValidator)

    const user = await User.findBy('email', email)

    if (user) {
      // Rate limit: max 3 codes per hour
      const recentCount = await PasswordResetToken.query()
        .where('user_id', user.id)
        .where('created_at', '>', DateTime.now().minus({ hours: 1 }).toSQL())
        .count('* as total')

      const total = Number(recentCount[0].$extras.total)

      if (total < 3) {
        // Invalidate all previous unused codes
        await PasswordResetToken.query()
          .where('user_id', user.id)
          .whereNull('used_at')
          .update({ used_at: DateTime.now().toSQL() })

        // Generate and store code
        const code = String(randomInt(100000, 999999))
        const codeHash = await hash.make(code)

        await PasswordResetToken.create({
          userId: user.id,
          hash: codeHash,
          expiresAt: DateTime.now().plus({ minutes: 15 }),
        })

        // DEV: log code to console since Resend test domain blocks non-account emails
        if (process.env.NODE_ENV === 'development') {
          logger.info({ email: user.email, code }, '🔑 DEV reset code')
        }

        // Send email
        try {
        await mail.send((message) => {
          message
            .to(user.email)
            .subject('Votre code de réinitialisation - BreakUp')
            .html(`
              <!DOCTYPE html>
              <html>
              <body style="margin:0;padding:0;background-color:#FDF6EC;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
                <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
                  <tr><td align="center">
                    <table width="100%" style="max-width:420px;background-color:#ffffff;border-radius:16px;padding:40px 32px;">
                      <tr><td align="center" style="padding-bottom:24px;font-size:48px;">💜</td></tr>
                      <tr><td align="center" style="padding-bottom:8px;">
                        <h1 style="margin:0;font-size:22px;color:#1a1a2e;">Réinitialisation du mot de passe</h1>
                      </td></tr>
                      <tr><td align="center" style="padding-bottom:28px;">
                        <p style="margin:0;font-size:15px;color:#6b7280;">Bonjour ${user.firstName}, voici ton code :</p>
                      </td></tr>
                      <tr><td align="center" style="padding-bottom:28px;">
                        <div style="background-color:#F5F0FF;border-radius:12px;padding:20px 32px;display:inline-block;letter-spacing:8px;font-size:32px;font-weight:700;color:#7C3AED;">
                          ${code}
                        </div>
                      </td></tr>
                      <tr><td align="center" style="padding-bottom:12px;">
                        <p style="margin:0;font-size:13px;color:#9CA3AF;">Ce code expire dans <strong>15 minutes</strong>.</p>
                      </td></tr>
                      <tr><td align="center">
                        <p style="margin:0;font-size:13px;color:#9CA3AF;">Si tu n'as pas demandé cette réinitialisation, ignore cet email.</p>
                      </td></tr>
                    </table>
                  </td></tr>
                </table>
              </body>
              </html>
            `)
        })
        logger.info({ email: user.email }, 'Password reset email sent')
        } catch (error) {
          logger.error({ error, email: user.email }, 'Failed to send password reset email')
        }
      }
    }

    // Always return success (anti-enumeration)
    return response.ok({
      message:
        'Si un compte existe avec cet email, un code de réinitialisation a été envoyé.',
    })
  }

  /**
   * Verify the 6-digit OTP code without consuming it.
   */
  async verifyCode({ request, response }: HttpContext) {
    const { email, code } = await request.validateUsing(verifyResetCodeValidator)

    const user = await User.findBy('email', email)
    if (!user) {
      return response.badRequest({ message: 'Code invalide ou expiré.' })
    }

    const token = await PasswordResetToken.query()
      .where('user_id', user.id)
      .whereNull('used_at')
      .where('expires_at', '>', DateTime.now().toSQL())
      .where('attempts', '<', 5)
      .orderBy('created_at', 'desc')
      .first()

    if (!token) {
      return response.badRequest({ message: 'Code invalide ou expiré.' })
    }

    const isValid = await hash.verify(token.hash, code)

    if (!isValid) {
      token.attempts += 1
      await token.save()
      return response.badRequest({ message: 'Code invalide ou expiré.' })
    }

    return response.ok({ valid: true })
  }

  /**
   * Reset password using a valid OTP code.
   */
  async resetPassword({ request, response }: HttpContext) {
    const { email, code, password } = await request.validateUsing(resetPasswordValidator)

    const user = await User.findBy('email', email)
    if (!user) {
      return response.badRequest({ message: 'Code invalide ou expiré.' })
    }

    const token = await PasswordResetToken.query()
      .where('user_id', user.id)
      .whereNull('used_at')
      .where('expires_at', '>', DateTime.now().toSQL())
      .where('attempts', '<', 5)
      .orderBy('created_at', 'desc')
      .first()

    if (!token) {
      return response.badRequest({ message: 'Code invalide ou expiré.' })
    }

    const isValid = await hash.verify(token.hash, code)

    if (!isValid) {
      token.attempts += 1
      await token.save()
      return response.badRequest({ message: 'Code invalide ou expiré.' })
    }

    // Update password (AuthFinder mixin auto-hashes)
    user.password = password
    await user.save()

    // Mark token as used
    token.usedAt = DateTime.now()
    await token.save()

    return response.ok({ message: 'Mot de passe réinitialisé avec succès.' })
  }
}
