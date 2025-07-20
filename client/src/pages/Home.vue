<template>
  <div class="landing-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <div class="hero-left">
            <h1 class="hero-title">Où les romans de demain s'écrivent</h1>
            <p class="hero-description">
              ForgeWrite est une plateforme d'écriture conçue spécialement pour les auteurs.
              Elle vous offre un environnement innovant pour faciliter l'écriture de votre livre,
              structurer votre manuscrit, stimuler votre créativité et perfectionner votre texte.
            </p>
            <button class="btn-primary">Commencer</button>
          </div>
          <div class="hero-right">
            <div class="hero-illustration">
              <img src="@/assets/landing/pen-hero.png" alt="Pen Hero" class="pen-hero-image" />
            </div>
          </div>
        </div>
      </div>

    </section>

    <!-- Paint Section -->
    <section class="paint-section">
      <div class="container">
        <div class="paint-container">
          <img src="@/assets/landing/paint1.png" alt="Paint Background" class="paint-background" />
          <div class="paint-content">
            <div class="paint-subtitle">Créez sans limites</div>
            <p class="paint-text">
              Libérez votre créativité avec nos outils d'écriture intuitifs. Du développement de personnages à la structuration de l'intrigue,
              ForgeWrite vous fournit tout ce dont vous avez besoin pour donner vie à vos histoires. Laissez libre cours à votre imagination
              en créant des récits captivants qui fascineront vos lecteurs.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features">
      <div class="container">
        <div class="feature-item">
          <div class="feature-text">
            <div class="feature-badge">Organisation de manuscrit</div>
            <h2>Structurez votre histoire</h2>
            <p>Organisez vos chapitres, personnages et points d'intrigue avec notre système de gestion de manuscrit intuitif.
              Créez des profils de personnages détaillés avec des traits de personnalité, des histoires personnelles et des arcs de développement. Suivez les fils narratifs à travers plusieurs chapitres, assurant cohérence et fluidité. Gérez les chronologies d'histoire, les notes de construction d'univers et les matériaux de recherche, le tout en un lieu centralisé. Fixez-vous des objectifs d'écriture, surveillez vos progrès quotidiens et maintenez votre élan avec des outils de suivi de productivité intégrés qui s'adaptent à votre style d'écriture unique.</p>
          </div>
          <div class="feature-icon">
            <img src="@/assets/landing/feature1.png" alt="Feature 1" class="feature-image" />
          </div>
        </div>

        <div class="feature-item">
          <div class="feature-icon">
            <img src="@/assets/landing/ai1.png" alt="AI Assistant" class="feature-image" />
          </div>
          <div class="feature-text">
            <div class="feature-badge">Assistant d'écriture IA</div>
            <h2>Écrivez avec l'aide de l'IA</h2>
            <p>Améliorez votre processus d'écriture avec notre assistant IA intelligent qui aide à surmonter le blocage de l'écrivain et
              stimule la créativité. Obtenez des suggestions personnalisées pour le développement d'intrigue, les interactions de personnages et l'amélioration des dialogues. Générez des idées pour les scènes, chapitres et arcs narratifs adaptés à votre genre et style d'écriture. Recevez des commentaires en temps réel sur le rythme, le ton et la structure narrative. Notre IA apprend de vos préférences pour fournir des suggestions de plus en plus pertinentes tout en préservant votre voix unique et votre vision créative.</p>
          </div>
        </div>

        <div class="feature-item">
          <div class="feature-text">
            <div class="feature-badge">Export et publication</div>
            <h2>Personnalisez votre export</h2>
            <p>Transformez votre manuscrit en publications professionnelles avec nos outils avancés de personnalisation d'export.
              Choisissez parmi plusieurs formats incluant PDF, EPUB, DOCX et HTML avec des options de formatage affinées.
              Personnalisez les polices, marges, espacement et mise en page pour répondre aux exigences des éditeurs ou à vos préférences personnelles. Ajoutez automatiquement des en-têtes, pieds de page, pages de titre et tables des matières personnalisés. Appliquez différents modèles de style pour différents genres, de la fiction littéraire aux manuels techniques. Prévisualisez votre document formaté avant l'export et effectuez des ajustements en temps réel pour vous assurer que votre travail apparaisse exactement comme prévu pour l'impression ou la distribution numérique.</p>
          </div>
          <div class="feature-icon">
            <img src="@/assets/landing/export1.png" alt="Export Customization" class="feature-image" />
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="how-it-works">
      <!-- Part 1: Title and Image -->
      <div class="how-it-works-hero">
        <div class="container">
          <div class="how-it-works-content">
            <div class="how-it-works-text">
              <h2>COMMENT ÇA MARCHE ?</h2>
            </div>
            <div class="how-it-works-image">
              <img src="@/assets/landing/il_4.png" alt="How It Works" class="how-it-works-img" />
            </div>
          </div>
        </div>
      </div>

      <!-- Part 2: Steps -->
      <div class="how-it-works-steps">
        <div class="container">
          <div class="steps">
            <div class="step">
              <div class="step-text">1.</div>
              <p>Commencez votre parcours d'écriture en créant votre compte ForgeWrite gratuit. Configurez votre profil, choisissez vos préférences d'écriture et préparez-vous à donner vie à vos histoires avec notre suite complète d'outils de création.</p>
            </div>
            <div class="step">
              <div class="step-text">2.</div>
              <p>Utilisez notre éditeur puissant pour rédiger vos chapitres, développer des personnages convaincants et organiser vos points d'intrigue. Profitez de l'assistance IA, des outils de développement de personnages et de la gestion de chronologie pour créer un récit bien structuré.</p>
            </div>
            <div class="step">
              <div class="step-text">3.</div>
              <p>Transformez votre manuscrit terminé en publications professionnelles avec nos outils d'export avancés. Choisissez parmi plusieurs formats, personnalisez les mises en page et préparez votre travail pour soumission aux éditeurs ou plateformes d'auto-édition.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Why Choose Section -->
    <section class="why-choose">
      <div class="container">
        <div class="why-content">
          <h2>Pourquoi choisir ForgeWrite ?</h2>
          <p>Rejoignez des milliers d'auteurs qui font confiance à ForgeWrite pour donner vie à leurs histoires.
            Notre plateforme combine des outils d'écriture puissants avec un design intuitif pour vous aider à vous concentrer sur ce qui compte le plus -
            votre histoire.</p>
          <p>Que vous soyez un romancier chevronné ou que vous commenciez tout juste votre parcours d'écriture, ForgeWrite s'adapte à votre processus créatif unique. Notre suite complète d'outils grandit avec vous, de la réflexion initiale à la publication finale. Découvrez des fonctionnalités de collaboration fluides, une organisation avancée de manuscrits et une assistance d'écriture alimentée par l'IA qui comprend votre voix tout en préservant votre vision créative.</p>
          <p>Avec ForgeWrite, vous n'écrivez pas simplement un livre – vous créez un chef-d'œuvre avec le soutien d'une technologie de pointe et d'une communauté de conteurs passionnés. Transformez vos idées en récits captivants avec confiance, soutenus par des outils leaders de l'industrie et une liberté créative inégalée.</p>
          <div class="why-illustration">
            <img src="@/assets/landing/il_5.png" alt="Illustration d'écriture" class="why-image" />
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="cta">
      <div class="container">
        <div class="cta-content">
          <h2>Transformez votre parcours d'écriture</h2>
          <p>Prêt à porter votre écriture au niveau supérieur ? Rejoignez ForgeWrite aujourd'hui et découvrez les outils qui vous aideront à
            créer votre chef-d'œuvre.</p>
          <div class="cta-buttons">
            <button class="btn-primary">S'inscrire maintenant</button>
            <button class="btn-secondary">Essayez gratuitement</button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// Page temporaire d'accueil
</script>

<style scoped>
/* Global Styles */
.landing-page {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #FCF8ED;
  overflow-x: hidden;
  /* Prevent horizontal scrolling */
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Hero Section */
.hero {
  background: #3C68C2;
  color: #FCF8ED;
  display: flex;
  align-items: center;
  min-height: 600px;
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: bold;
  line-height: 1.2;
  margin-bottom: 1.5rem;
}

.hero-description {
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.btn-primary {
  background: #FCF8ED;
  color: #3C68C2;
  border: none;
  padding: 1rem 2rem;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

/* Hero Illustration */
.hero-right {
  display: flex;
  justify-content: center;
  align-items: center;
}

.hero-illustration {
  width: 100%;
  max-width: 800px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  height: 100%;
  min-height: 800px;
}

.pen-hero-image {
  width: 100%;
  height: auto;
  max-width: 600px;
  min-height: 500px;
  object-fit: contain;
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.1));
  animation: float 6s ease-in-out infinite;
  transform: translateY(20px);
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-10px);
  }
}

/* Paint Section */
.paint-section {
  background: #3C68C2;
}

.paint-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  overflow: hidden;
  /* Ensure no content spills out */
  max-width: 100vw;
  /* Prevent exceeding viewport width */
}

.paint-background {
  display: block;
  width: 100%;
  height: auto;
}

.paint-content {
  position: absolute;
  bottom: 5%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  text-align: center;
  max-width: 600px;
  padding: 3rem 2rem;
  color: #004687;
}

.paint-subtitle {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 2rem;
  color: #004687;
}

.paint-text {
  font-size: 1.2rem;
  line-height: 1.8;
  color: #004687;
  font-weight: 500;
}

/* Features Section */
.features {
  padding: 6rem 0;
  background: #FCF8ED;
}

.feature-item {
  border-radius: 20px;
  padding: 3rem;
  margin: 3rem 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: center;
}

.feature-item:nth-child(even) {
  grid-template-columns: 1fr 1fr;
}

.feature-item:nth-child(even) .feature-icon {
  order: -1;
}

.feature-badge {
  background: #3C68C2;
  color: #FCF8ED;
  padding: 0.5rem 1rem;
  border-radius: 15px;
  font-size: 0.9rem;
  font-weight: 500;
  width: fit-content;
  margin-bottom: 1rem;
}

.feature-item h2 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #3C68C2;
}

.feature-item p {
  font-size: 1.1rem;
  color: #004687;
  line-height: 1.6;
}

.feature-text {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.feature-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.feature-image {
  width: 100%;
  height: auto;
  max-width: 500px;
  object-fit: contain;
  border-radius: 10px;
}

.document-icon,
.writing-icon,
.export-icon {
  width: 120px;
  height: 120px;
  background: #3C68C2;
  border-radius: 20px;
  position: relative;
}

.document-icon::after {
  content: "📄";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 3rem;
}

.writing-icon::after {
  content: "✏️";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 3rem;
}

.export-icon::after {
  content: "📤";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 3rem;
}

/* How It Works Section */
.how-it-works {
  background: #FCF8ED;
  border-bottom: 2px solid #004687;
}

/* Part 1: Hero with title and image */
.how-it-works-hero {
  background: #3C68C2;
  padding: 6rem 0;
}

.how-it-works-content {
  display: flex;
  flex-direction: column;
  gap: 3rem;
  align-items: center;
  text-align: center;
  max-width: none;
  margin: 0 auto;
}

.how-it-works-text h2 {
  font-size: 4rem;
  font-weight: bold;
  color: #FCF8ED;
  line-height: 1.2;
  margin: 0;
}

.how-it-works-image {
  display: flex;
  justify-content: center;
  align-items: center;
}

.how-it-works-img {
  width: 100%;
  height: auto;
  max-width: 800px;
  object-fit: contain;
}

/* Part 2: Steps */
.how-it-works-steps {
  padding: 6rem 0;
  background: #FCF8ED;
}

.steps {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3rem;
}

.step {
  text-align: left;
  padding: 2rem;
}

.step-text {
  font-family: 'DFVN Gregonia', serif;
  font-size: 3rem;
  font-weight: bold;
  color: #004687;
  margin-bottom: 1.5rem;
}

.step p {
  color: #004687;
  line-height: 1.6;
}

/* Why Choose Section */
.why-choose {
  padding: 6rem 0;
  background: #FCF8ED;
}

.why-content {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.why-content h2 {
  font-size: 3rem;
  color: #3C68C2;
  margin-bottom: 2rem;
}

.why-content p {
  font-size: 1.2rem;
  color: #004687;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.why-illustration {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 3rem;
}

.why-image {
  width: 100%;
  height: auto;
  max-width: 600px;
  object-fit: contain;
  border-radius: 15px;
}

/* Call to Action */
.cta {
  background: #3C68C2;
  color: #FCF8ED;
  padding: 6rem 0;
}

.cta-content {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.cta-content h2 {
  font-size: 3rem;
  margin-bottom: 1.5rem;
}

.cta-content p {
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 3rem;
  line-height: 1.6;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-secondary {
  background: transparent;
  color: #FCF8ED;
  border: 2px solid #FCF8ED;
  padding: 1rem 2rem;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-secondary:hover {
  background: #FCF8ED;
  color: #3C68C2;
  transform: translateY(-2px);
}

/* Responsive Design */
@media (max-width: 768px) {

  .hero-content,
  .feature-item {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .paint-container {
    width: 100vw;
    margin-left: calc(-50vw + 50%);
    overflow-x: hidden;
  }

  .how-it-works-content {
    width: 95vw;
    text-align: center;
  }

  .how-it-works-text h2 {
    font-size: 3rem;
  }

  .steps {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .step {
    text-align: center;
  }

  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }
}
</style>
