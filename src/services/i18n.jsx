// services/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation data
const resources = {
  en: {
    translation: {
      "coming_soon": "Coming Soon",
      "get_notified": "GET NOTIFIED WHEN LAUNCH",
      "notify_me": "Notify Me",
      "email_placeholder": "Enter email",
      "about_us": "About Us",
      "services": "Our Services",
      "faq": "FAQ's",
      "connect_us": "Connect Us!",
      "footer_text": `<i>Axipays</i> is a <i>Licensed Payment Gateway</i> serving a diverse range of industries, from <i>Everyday Transactions to Creative Ventures</i>.<br></br> We are dedicated to delivering <i>Secure</i> and <i>Efficient Payment Solutions</i>. Stay tuned for exciting updates on our upcoming services.<br></br> For inquiries or support, please contact us at <i class="email">support@axipays.com</i>. We appreciate your patience and look forward to serving you.`,
      "licensed_regions": "Axipays is licensed to serve these regions globally.",
      "footer_copyright": "2024 Axipays. All rights reserved."
    }
  },

  es: {
    translation: {
      "coming_soon": "Próximamente Disponible",
      "get_notified": "RECIBA NOTIFICACIONES CUANDO SE LANCE",
      "notify_me": "Notifícame",
      "email_placeholder": "Ingrese su correo electrónico",
      "about_us": "Sobre Nosotros",
      "services": "Nuestros Servicios",
      "faq": "Preguntas Frecuentes",
      "connect_us": "¡Conéctenos!",
      "footer_text": `<i>Axipays</i> es una <i>Pasarela de Pago Autorizada</i> que atiende una amplia gama de industrias, desde <i>Transacciones Diarias hasta Proyectos Creativos</i>.<br></br> Estamos comprometidos a brindar <i>Soluciones de Pago Seguras</i> y <i>Eficientes</i>. Manténgase al tanto de las emocionantes actualizaciones de nuestros próximos servicios.<br></br> Para consultas o soporte, contáctenos en <i class="email">support@axipays.com</i>. Agradecemos su paciencia y esperamos poder servirle.`,
      "licensed_regions": "Axipays tiene licencia para servir a estas regiones a nivel mundial.",
      "footer_copyright": "2024 Axipays. Todos los derechos reservados."
    }
  },  

  fr: {
    translation: {
      "coming_soon": "Bientôt Disponible",
      "get_notified": "SOYEZ INFORMÉ LORS DU LANCEMENT",
      "notify_me": "Prévenez-moi",
      "email_placeholder": "Entrez votre e-mail",
      "about_us": "À propos de nous",
      "services": "Nos Services",
      "faq": "FAQ",
      "connect_us": "Connectez-nous !",
      "footer_text": `<i>Axipays</i> est une <i>Passerelle de Paiement Agréée</i> desservant une gamme diversifiée d'industries, des <i>Transactions Quotidiennes aux Projets Créatifs</i>.<br></br> Nous nous engageons à fournir des <i>Solutions de Paiement Sécurisées</i> et <i>Efficaces</i>. Restez à l'écoute pour les prochaines mises à jour excitantes de nos services.<br></br> Pour toute demande ou assistance, contactez-nous à <i class="email">support@axipays.com</i>. Nous apprécions votre patience et avons hâte de vous servir.`,
      "licensed_regions": "Axipays est agréé pour desservir ces régions à l'échelle mondiale.",
      "footer_copyright": "2024 Axipays. Tous droits réservés."
    }
  },
  
  de: {
    translation: {
      "coming_soon": "Bald verfügbar",
      "get_notified": "WERDEN SIE BENACHRICHTIGT, WENN ES STARTET",
      "notify_me": "Benachrichtigen Sie mich",
      "email_placeholder": "Geben Sie Ihre E-Mail ein",
      "about_us": "Über uns",
      "services": "Unsere Dienstleistungen",
      "faq": "Häufige Fragen",
      "connect_us": "Verbinden Sie uns!",
      "footer_text": `<i>Axipays</i> ist eine <i>Lizenzierte Zahlungsgateway</i>, die eine Vielzahl von Branchen bedient, von <i>Täglichen Transaktionen bis zu Kreativen Projekten</i>.<br></br> Wir setzen uns dafür ein, <i>Sichere</i> und <i>Effiziente Zahlungslösungen</i> bereitzustellen. Bleiben Sie auf dem Laufenden für aufregende Updates zu unseren kommenden Diensten.<br></br> Bei Anfragen oder Support wenden Sie sich bitte an <i class="email">support@axipays.com</i>. Wir schätzen Ihre Geduld und freuen uns darauf, Ihnen zu dienen.`,
      "licensed_regions": "Axipays ist lizenziert, um diese Regionen weltweit zu bedienen.",
      "footer_copyright": "2024 Axipays. Alle Rechte vorbehalten."

    }
  },

  jp: {
    translation: {
      "coming_soon": "近日公開",
      "get_notified": "リリース時に通知を受け取る",
      "notify_me": "通知を受け取る",
      "email_placeholder": "メールアドレスを入力してください",
      "about_us": "私たちについて",
      "services": "サービス",
      "faq": "よくある質問",
       "connect_us": "私たちに連絡してください！",
      "footer_text": `<i>アキシペイズ</i> は、<i>ライセンス認定された決済ゲートウェイ</i> であり、<i>日常の取引から創造的なベンチャー</i> に至るまで、さまざまな業界に対応しています。<br></br> 私たちは、<i>安全</i> で <i>効率的な決済ソリューション</i> を提供することに専念しています。今後のサービスについてのエキサイティングな更新をお待ちください。<br></br> ご質問やサポートが必要な場合は、<i class="email">support@axipays.com</i> までお問い合わせください。`,
      "licensed_regions": "アキシペイズ は、世界中のこれらの地域でライセンスされています。",
      "footer_copyright": "2024 アキシペイズ. 全著作権所有。"

    }
  }
  
  
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en', // fallback language
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;