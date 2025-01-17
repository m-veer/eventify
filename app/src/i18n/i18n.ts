import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          search: {
            placeholder: "Search events",
          },
          nav: {
            browse: "Browse Events",
            help: "Help",
            login: "Log In",
            signup: "Sign Up",
          },
          categories: {
            comedy: "COMEDY EVENTS",
            tech: "TECH EVENTS",
            location: "Boston",
          },
          footer: {
            about: {
              title: "About Eventify",
              description:
                "Discover and book the best events in your city. From comedy shows to tech conferences, we've got you covered.",
            },
            quickLinks: {
              title: "Quick Links",
              aboutUs: "About Us",
              contact: "Contact",
              terms: "Terms & Conditions",
              privacy: "Privacy Policy",
              developers: "Developer Team",
            },
            followUs: "Follow Us",
          },
        },
      },
      hi: {
        translation: {
          search: {
            placeholder: "कार्यक्रम खोजें",
          },
          nav: {
            browse: "कार्यक्रम ब्राउज़ करें",
            help: "मदद",
            login: "लॉग इन करें",
            signup: "साइन अप करें",
          },
          categories: {
            comedy: "कॉमेडी इवेंट्स",
            tech: "टेक इवेंट्स",
            location: "बोस्टन",
          },
          footer: {
            about: {
              title: "इवेंटिफाई के बारे में",
              description:
                "अपने शहर में सर्वश्रेष्ठ कार्यक्रम खोजें और बुक करें। कॉमेडी शो से लेकर टेक कॉन्फ्रेंस तक, हम आपको कवर करते हैं।",
            },
            quickLinks: {
              title: "त्वरित लिंक्स",
              aboutUs: "हमारे बारे में",
              contact: "संपर्क करें",
              terms: "नियम और शर्तें",
              privacy: "गोपनीयता नीति",
              developers: "डेवलपर टीम",
            },
            followUs: "हमें फॉलो करें",
          },
        },
      },
      es: {
        translation: {
          search: {
            placeholder: "Buscar eventos",
          },
          nav: {
            browse: "Explorar Eventos",
            help: "Ayuda",
            login: "Iniciar Sesión",
            signup: "Registrarse",
          },
          categories: {
            comedy: "EVENTOS DE COMEDIA",
            tech: "EVENTOS DE TECNOLOGÍA",
            location: "Boston",
          },
          footer: {
            about: {
              title: "Sobre Eventify",
              description:
                "Descubre y reserva los mejores eventos en tu ciudad. Desde shows de comedia hasta conferencias tecnológicas, te tenemos cubierto.",
            },
            quickLinks: {
              title: "Enlaces Rápidos",
              aboutUs: "Sobre Nosotros",
              contact: "Contacto",
              terms: "Términos y Condiciones",
              privacy: "Política de Privacidad",
              developers: "Equipo de Desarrollo",
            },
            followUs: "Síguenos",
          },
        },
      },
      mr: {
        translation: {
          search: {
            placeholder: "कार्यक्रम शोधा",
          },
          nav: {
            browse: "कार्यक्रम ब्राउझ करा",
            help: "मदत",
            login: "लॉग इन करा",
            signup: "साइन अप करा",
          },
          categories: {
            comedy: "विनोदी कार्यक्रम",
            tech: "तंत्रज्ञान कार्यक्रम",
            location: "बोस्टन",
          },
          footer: {
            about: {
              title: "इवेंटिफाई बद्दल",
              description:
                "तुमच्या शहरातील सर्वोत्तम कार्यक्रम शोधा आणि बुक करा. विनोदी शो पासून टेक कॉन्फरन्स पर्यंत, आम्ही तुम्हाला कव्हर करतो.",
            },
            quickLinks: {
              title: "जलद दुवे",
              aboutUs: "आमच्याबद्दल",
              contact: "संपर्क",
              terms: "नियम आणि अटी",
              privacy: "गोपनीयता धोरण",
              developers: "डेव्हलपर टीम",
            },
            followUs: "आम्हाला फॉलो करा",
          },
        },
      },
      gu: {
        translation: {
          search: {
            placeholder: "ઇવેન્ટ્સ શોધો",
          },
          nav: {
            browse: "ઇવેન્ટ્સ બ્રાઉઝ કરો",
            help: "મદદ",
            login: "લૉગ ઇન",
            signup: "સાઇન અપ",
          },
          categories: {
            comedy: "કૉમેડી ઇવેન્ટ્સ",
            tech: "ટેક ઇવેન્ટ્સ",
            location: "બોસ્ટન",
          },
          footer: {
            about: {
              title: "ઇવેન્ટિફાઇ વિશે",
              description:
                "તમારા શહેરમાં શ્રેષ્ઠ ઇવેન્ટ્સ શોધો અને બુક કરો. કૉમેડી શો થી લઈને ટેક કોન્ફરન્સ સુધી, અમે તમને કવર કરીએ છીએ.",
            },
            quickLinks: {
              title: "ઝડપી લિંક્સ",
              aboutUs: "અમારા વિશે",
              contact: "સંપર્ક",
              terms: "નિયમો અને શરતો",
              privacy: "ગોપનીયતા નીતি",
              developers: "ડેવલપર ટીમ",
            },
            followUs: "અમને ફોલો કરો",
          },
        },
      },
    },
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
