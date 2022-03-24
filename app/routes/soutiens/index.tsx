import { Card, CardContent, Container, Grid, Typography } from "@mui/material";

export default function Soutiens() {
  const videos = [
    {
      ville: "Tours",
      link: "https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2FflibustechBDE2020%2Fvideos%2F5311122275587247%2F&show_text=false&width=560&t=0",
    },
    {
      ville: "Annecy",
      link: "https://www.facebook.com/plugins/video.php?height=322&href=https%3A%2F%2Fwww.facebook.com%2FflibustechBDE2022%2Fvideos%2F339203664684792%2F&show_text=false&width=560&t=0",
    },
  ];

  return (
    <Container component="main" maxWidth="xl" sx={{ marginTop: "50px" }}>
      <Typography marginBottom="50px" variant="h2" textAlign="center">
        No soutiens du Rezo
      </Typography>
      <Grid
        container
        spacing={{ xs: 2, md: 6 }}
        columns={{ xs: 1, sm: 1, md: 1, lg: 8 }}
      >
        {videos.map((video) => (
          <Grid
            sx={{ width: "fit-content" }}
            textAlign="center"
            item
            xs={2}
            sm={4}
            md={4}
            xl={4}
            key={video.ville}
          >
            <Card>
              <CardContent>
                <Typography textAlign="center" variant="h4">
                  {video.ville}
                </Typography>
                <iframe
                  src={video.link}
                  height="314"
                  width="560"
                  style={{ border: "none", overflow: "hidden" }}
                  scrolling="no"
                  allowFullScreen="true"
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                ></iframe>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
