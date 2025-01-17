import React from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
} from "@mui/material";
import { Facebook, Twitter, Instagram, LinkedIn } from "@mui/icons-material";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <Box sx={{ bgcolor: "grey.200", py: 6 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" sx={{ color: "black" }} gutterBottom>
              {t("footer.about.title")}
            </Typography>
            <Typography variant="body2" sx={{ color: "red" }}>
              {t("footer.about.description")}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" sx={{ color: "black" }} gutterBottom>
              {t("footer.quickLinks.title")}
            </Typography>
            <Link href="/about" display="block" sx={{ color: "red" }}>
              {t("footer.quickLinks.aboutUs")}
            </Link>
            <Link href="/contact-us" display="block" sx={{ color: "red" }}>
              {t("footer.quickLinks.contact")}
            </Link>
            <Link href="/terms" display="block" sx={{ color: "red" }}>
              {t("footer.quickLinks.terms")}
            </Link>
            <Link href="/privacy-policy" display="block" sx={{ color: "red" }}>
              {t("footer.quickLinks.privacy")}
            </Link>
            <Link href="/developed-by" display="block" sx={{ color: "red" }}>
              {t("footer.quickLinks.developers")}
            </Link>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" sx={{ color: "black" }} gutterBottom>
              {t("footer.followUs")}
            </Typography>
            <IconButton sx={{ color: "red" }}>
              <Facebook />
            </IconButton>
            <IconButton sx={{ color: "red" }}>
              <Twitter />
            </IconButton>
            <IconButton sx={{ color: "red" }}>
              <Instagram />
            </IconButton>
            <IconButton sx={{ color: "red" }}>
              <LinkedIn />
            </IconButton>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
