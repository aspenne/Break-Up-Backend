import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const AuthController = () => import('#controllers/auth_controller')
const PasswordResetController = () => import('#controllers/password_reset_controller')
const UsersController = () => import('#controllers/users_controller')
const MemoriesController = () => import('#controllers/memories_controller')
const ChatRoomsController = () => import('#controllers/chat_rooms_controller')
const MessagesController = () => import('#controllers/messages_controller')
const ArticlesController = () => import('#controllers/articles_controller')
const JournalEntriesController = () => import('#controllers/journal_entries_controller')
const JournalPromptsController = () => import('#controllers/journal_prompts_controller')
const JournalTimelineController = () => import('#controllers/journal_timeline_controller')

// Health check
router.get('/', async () => {
  return { status: 'ok', app: 'BreakUp API', version: '1.0.0' }
})

// ============== AUTH (public) ==============
router
  .group(() => {
    router.post('register', [AuthController, 'register'])
    router.post('login', [AuthController, 'login'])
    router.post('refresh', [AuthController, 'refresh'])
    router.post('forgot-password', [PasswordResetController, 'forgotPassword'])
    router.post('verify-reset-code', [PasswordResetController, 'verifyCode'])
    router.post('reset-password', [PasswordResetController, 'resetPassword'])
  })
  .prefix('api/auth')

// ============== AUTH (protected) ==============
router
  .group(() => {
    router.post('logout', [AuthController, 'logout'])
    router.get('me', [AuthController, 'me'])
  })
  .prefix('api/auth')
  .use(middleware.auth())

// ============== USERS ==============
router
  .group(() => {
    router.patch('me', [UsersController, 'update'])
  })
  .prefix('api/users')
  .use(middleware.auth())

// ============== MEMORIES ==============
router
  .group(() => {
    router.get('/', [MemoriesController, 'index'])
    router.post('/', [MemoriesController, 'store'])
    router.patch(':id', [MemoriesController, 'update'])
    router.delete(':id', [MemoriesController, 'destroy'])
  })
  .prefix('api/memories')
  .use(middleware.auth())

// ============== CHAT ==============
router
  .group(() => {
    router.get('rooms', [ChatRoomsController, 'index'])
    router.post('rooms', [ChatRoomsController, 'store'])
    router.post('rooms/:id/join', [ChatRoomsController, 'join'])
    router.post('rooms/:id/leave', [ChatRoomsController, 'leave'])
    router.get('rooms/:id/messages', [MessagesController, 'index'])
    router.post('rooms/:id/messages', [MessagesController, 'store'])
  })
  .prefix('api/chat')
  .use(middleware.auth())

// ============== BLOG (public) ==============
router
  .group(() => {
    router.get('articles', [ArticlesController, 'index'])
    router.get('articles/:id', [ArticlesController, 'show'])
  })
  .prefix('api/blog')

// ============== BLOG (auth required for favorites) ==============
router
  .group(() => {
    router.post('articles/:id/favorite', [ArticlesController, 'toggleFavorite'])
    router.get('favorites', [ArticlesController, 'favorites'])
  })
  .prefix('api/blog')
  .use(middleware.auth())

// ============== BLOG (admin only) ==============
router
  .group(() => {
    router.post('articles', [ArticlesController, 'store'])
  })
  .prefix('api/blog')
  .use([middleware.auth(), middleware.admin()])

// ============== JOURNAL ==============
router
  .group(() => {
    router.get('entries', [JournalEntriesController, 'index'])
    router.post('entries', [JournalEntriesController, 'store'])
    router.patch('entries/:id', [JournalEntriesController, 'update'])
    router.delete('entries/:id', [JournalEntriesController, 'destroy'])
    router.get('prompts', [JournalPromptsController, 'index'])
    router.get('timeline', [JournalTimelineController, 'index'])
  })
  .prefix('api/journal')
  .use(middleware.auth())
