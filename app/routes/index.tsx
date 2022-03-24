import { Container, Grid, Typography } from "@mui/material";
import ContrastedSection from "~/components/contrastedSection";
import Footer from "~/components/footer";
import HeroSection from "~/components/heroSection";
import PartnershipList from "~/components/partnershipList";
import TitledSection from "~/components/titledSection";

export default function Index() {
  return (
    <>
      <HeroSection imgSrc="/assets/images/flibustech_hero.jpg" alt="Piratech team" />
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
        Les pirates de la Flibustech vous embarquent sur leur navire pour vous faire vivre des campagnes de folie.
      </ContrastedSection>
      <TitledSection title="Partenariats">
        <PartnershipList
          partnerships={[
            { name: "Festiprint", imgSrc: "/assets/images/partnerships/festiprint.png" },
            /* { name: "Ornikar", imgSrc: "/assets/images/partnerships/ornikar.png" }, */
            { name: "La fumerie", imgSrc: "/assets/images/partnerships/la_fumerie.png" },
            { name: "Go Sport", imgSrc: "/assets/images/partnerships/go_sport.png" },
            { name: "L'encas", imgSrc: "/assets/images/partnerships/l_encas.png" },
            { name: "Tropic Addict", imgSrc: "/assets/images/partnerships/tropic_addict.png" },
            { name: "Le 5 by La Cabane", imgSrc: "/assets/images/partnerships/le_5_by_la_cabane.png" },
            { name: "Laser Quest Comedie", imgSrc: "/assets/images/partnerships/laser_quest_comedie.jpeg" },
            { name: "Cartapapa", imgSrc: "/assets/images/partnerships/cartapapa.jpeg" },
            { name: "Run'Up", imgSrc: "/assets/images/partnerships/run_up.png" },
          ]}
        />
      </TitledSection>
      <Footer />
    </>
  );
}
