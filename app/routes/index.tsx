import { Container, Grid, Typography } from "@mui/material";
import ContrastedSection from "~/components/contrastedSection";
import Footer from "~/components/footer";
import HeroSection from "~/components/heroSection";
import PartnershipList from "~/components/partnershipList";
import TitledSection from "~/components/titledSection";

export default function Index() {
  return (
    <>
      <HeroSection
        imgSrc="/assets/images/flibustech_hero.jpg"
        alt="Piratech team"
      />
      <ContrastedSection
        title="Qui sommes-nous ?"
        /* button={{
            url: "/teams",
            text: "L'équipage",
        }} */
        image={{
          src: "/assets/images/logo.png",
          alt: "Piratech presentation",
        }}
      >
        Les pirates de la Flibustech vous embarquent sur leur navire pour vous
        faire vivre des campagnes de folie.
      </ContrastedSection>
      <TitledSection title="Partenariats">
        <PartnershipList
          partnerships={[
            {
              name: "Festiprint",
              imgSrc: "/assets/images/partnerships/festiprint.png",
            },
            {
              name: "DrinkWatch",
              imgSrc: "/assets/images/partnerships/drink_watch.png",
            },
            {
              name: "Ornikar",
              imgSrc: "/assets/images/partnerships/ornikar.png",
            },
            {
              name: "Espace copie",
              imgSrc: "/assets/images/partnerships/espace_copie.png",
            },
            {
              name: "La fumerie",
              imgSrc: "/assets/images/partnerships/la_fumerie.png",
            },
            {
              name: "Go Sport",
              imgSrc: "/assets/images/partnerships/go_sport.png",
            },
            {
              name: "Run Up",
              imgSrc: "/assets/images/partnerships/run_up.png",
            },
            {
              name: "L'Occitane en Provence",
              imgSrc: "/assets/images/partnerships/l_occitanie_en_provence.png",
            },
            {
              name: "L'encas",
              imgSrc: "/assets/images/partnerships/l_encas.png",
            },
            {
              name: "Tropic Addict",
              imgSrc: "/assets/images/partnerships/tropic_addict.png",
            },
            {
              name: "Fresh Burritos",
              imgSrc: "/assets/images/partnerships/fresh_burritos.png",
            },
            {
              name: "Le 5 by La Cabane",
              imgSrc: "/assets/images/partnerships/le_5_by_la_cabane.png",
            },
            {
              name: "Brioche dorée",
              imgSrc: "/assets/images/partnerships/brioche_doree.png",
            },
            {
              name: "Le Novelty",
              imgSrc: "/assets/images/partnerships/le_novelty.png",
            },
            {
              name: "La Mie Caline",
              imgSrc: "/assets/images/partnerships/la_mie_caline.png",
            },
            {
              name: "Café Romy",
              imgSrc: "/assets/images/partnerships/cafe_romy.png",
            },
            {
              name: "Twist'Air",
              imgSrc: "/assets/images/partnerships/twistair.png",
            },
            { name: "KFC Fac", imgSrc: "/assets/images/partnerships/kfc.png" },
            {
              name: "3 Brasseurs",
              imgSrc: "/assets/images/partnerships/3_brasseurs.png",
            },
            {
              name: "Game Taverne",
              imgSrc: "/assets/images/partnerships/game_taverne.png",
            },
          ]}
        />
      </TitledSection>
      <Footer />
    </>
  );
}
