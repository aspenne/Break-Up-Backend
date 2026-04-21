import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Article from '#models/article'
import { DateTime } from 'luxon'

export default class ArticleSeeder extends BaseSeeder {
  async run() {
    await Article.createMany([
      {
        title: 'Comprendre les relations toxiques : les signes a reconnaitre',
        excerpt:
          'Apprenez a identifier les comportements toxiques pour mieux vous en proteger.',
        content: `Les relations toxiques peuvent prendre de nombreuses formes. Elles se caracterisent souvent par un desequilibre de pouvoir, de la manipulation emotionnelle et un sentiment constant de marcher sur des oeufs.

Les signes les plus courants incluent :
- Le controle excessif de vos faits et gestes
- L'isolement progressif de vos proches
- Les critiques deguisees en "conseils"
- Le gaslighting : vous faire douter de votre propre realite
- Les cycles de tension et de reconciliation

Si vous reconnaissez ces schemas, sachez que vous n'etes pas responsable du comportement de l'autre. La premiere etape est d'en prendre conscience. La deuxieme est de chercher du soutien aupres de personnes de confiance ou de professionnels.

Rappelez-vous : une relation saine vous fait grandir, pas retrecir.`,
        category: 'toxic-relationships',
        readTimeMinutes: 8,
        imageUrl: null,
        publishedAt: DateTime.now(),
      },
      {
        title: 'Le deuil amoureux : les 5 etapes a traverser',
        excerpt:
          'Chaque rupture est un deuil. Comprendre les etapes aide a avancer.',
        content: `Apres une rupture, nous traversons des etapes similaires au deuil decrit par Elisabeth Kubler-Ross.

1. Le deni : "Ce n'est pas possible, on va se remettre ensemble."
2. La colere : "Comment a-t-il/elle pu me faire ca ?"
3. Le marchandage : "Si seulement j'avais fait les choses differemment..."
4. La depression : Un sentiment profond de vide et de tristesse.
5. L'acceptation : "C'est termine, et je peux avancer."

Ces etapes ne sont pas lineaires. Vous pouvez passer de l'une a l'autre, revenir en arriere, et c'est parfaitement normal. Il n'y a pas de calendrier pour guerir.

L'important est de vous autoriser a ressentir chaque emotion sans jugement. La douleur que vous ressentez est la preuve que vous avez aime, et c'est une belle chose.`,
        category: 'grief',
        readTimeMinutes: 10,
        imageUrl: null,
        publishedAt: DateTime.now(),
      },
      {
        title: 'Reconstruire la confiance apres une trahison',
        excerpt:
          'Comment retrouver la capacite de faire confiance apres avoir ete blesse(e).',
        content: `La trahison laisse des cicatrices profondes qui affectent notre capacite a faire confiance, non seulement aux autres mais aussi a nous-memes.

Voici quelques pistes pour reconstruire :

Commencez par vous faire confiance a vous-meme. Votre intuition n'etait peut-etre pas fausse — vous avez peut-etre ignore des signaux. Apprenez a ecouter votre voix interieure.

Prenez le temps necessaire. La confiance ne se reconstruit pas du jour au lendemain. C'est un processus graduel qui demande de la patience.

Ne generalisez pas. Une personne vous a trahi, mais cela ne signifie pas que tout le monde le fera. Chaque nouvelle rencontre merite sa propre chance.

Communiquez vos peurs. Dans vos futures relations, osez exprimer vos vulnerabilites. La vraie intimite nait de la transparence.

Enfin, pardonnez — non pas pour l'autre, mais pour vous liberer du poids de la rancune.`,
        category: 'trust',
        readTimeMinutes: 7,
        imageUrl: null,
        publishedAt: DateTime.now(),
      },
      {
        title: 'Se reconstruire : votre identite au-dela du couple',
        excerpt: 'Redecouvrir qui vous etes quand vous n\'etes plus "nous".',
        content: `Apres une longue relation, il est normal de se sentir perdu(e). Pendant des mois ou des annees, votre identite s'est construite autour du "nous". Aujourd'hui, il est temps de retrouver le "je".

Commencez par revisiter vos passions d'avant la relation. Qu'est-ce que vous aimiez faire avant ? Quels reves aviez-vous mis de cote ?

Explorez de nouvelles activites. C'est le moment ideal pour essayer ce cours de poterie, cette randonnee, ce voyage en solo que vous n'avez jamais ose faire.

Reconstruisez votre cercle social. Pendant une relation, on a tendance a s'eloigner de certains amis. Renouez ces liens.

Apprenez a apprecier votre propre compagnie. Sortez seul(e), dinez seul(e), voyagez seul(e). Vous decouvrirez une personne fascinante : vous-meme.

Ce n'est pas une perte, c'est une renaissance.`,
        category: 'rebuilding',
        readTimeMinutes: 6,
        imageUrl: null,
        publishedAt: DateTime.now(),
      },
      {
        title: '10 rituels de self-care pour les jours difficiles',
        excerpt:
          'Des gestes simples pour prendre soin de vous quand tout semble lourd.',
        content: `Les jours apres une rupture peuvent etre terriblement lourds. Voici 10 rituels simples pour prendre soin de vous :

1. Le rituel du matin : Commencez par 5 minutes de respiration profonde avant de toucher votre telephone.

2. Le journal de gratitude : Ecrivez 3 choses positives, meme infimes ("le soleil sur mon visage").

3. La marche sans but : Sortez marcher 20 minutes sans destination. Observez le monde autour de vous.

4. Le bain de deconnexion : Un bain chaud, sans telephone, avec de la musique douce.

5. La cuisine reconfortante : Preparez-vous un plat que vous aimez. Nourrissez votre corps avec amour.

6. Le mouvement : Yoga, danse dans votre salon, etirements — bougez comme votre corps le demande.

7. L'ecriture libre : Ecrivez tout ce qui vous passe par la tete pendant 10 minutes, sans filtre.

8. La deconnexion des reseaux : Une heure sans ecrans. Lisez, dessinez, revez.

9. L'appel a un proche : Pas pour parler de la rupture, juste pour rire et se sentir connecte(e).

10. Le rituel du soir : Avant de dormir, dites-vous une chose gentille. Vous le meritez.`,
        category: 'self-care',
        readTimeMinutes: 5,
        imageUrl: null,
        publishedAt: DateTime.now(),
      },
    ])
  }
}
