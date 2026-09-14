import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "fr" | "en" | "es" | "ar";

export const LANGS: { code: Lang; label: string }[] = [
  { code: "fr", label: "FR" },
  { code: "en", label: "EN" },
  { code: "es", label: "ES" },
  { code: "ar", label: "ع" },
];

type Dict = Record<string, string>;

const fr: Dict = {
  "nav.videos": "Vidéos",
  "nav.teaching": "Enseignement",
  "nav.booking": "Réservation",
  "nav.contact": "Contact",
  "hero.kicker": "Cours particuliers de guitare classique",
  "hero.title": "Professeur diplômé d'État, double lauréat en solfège et guitare",
  "hero.tagline":
    "Une pédagogie patiente et exigeante, construite autour du son, du geste et du plaisir de jouer.",
  "hero.book": "Réserver une séance",
  "hero.whatsapp": "WhatsApp",
  "videos.title": "En musique",
  "videos.subtitle": "Quelques extraits de jeu et de cours.",
  "videos.empty": "Vidéo à venir",
  "teaching.title": "Une méthode, quatre parcours",
  "teaching.kids": "Enfants",
  "teaching.kidsText": "Éveil musical par le jeu : rythme, écoute, premières cordes.",
  "teaching.teens": "Adolescents",
  "teaching.teensText": "Répertoire motivant et préparation aux examens.",
  "teaching.adults": "Adultes",
  "teaching.adultsText": "Cours souples, adaptés aux emplois du temps chargés.",
  "teaching.seniors": "Seniors",
  "teaching.seniorsText": "Rythme calme, sans pression de performance.",
  "teaching.langs": "Cours disponibles en : français, anglais, espagnol, arabe",
  "booking.title": "Réserver",
  "booking.level": "Niveau",
  "booking.beginner": "Débutant (Solfège / Guitare)",
  "booking.intermediate": "Intermédiaire (Guitare)",
  "booking.perHour": "DH / heure",
  "booking.pickDate": "Choisissez une date",
  "booking.pickHours": "Choisissez vos heures",
  "booking.pickDateFirst": "Sélectionnez d'abord une date.",
  "booking.taken": "Indisponible",
  "booking.name": "Nom complet",
  "booking.phone": "Téléphone",
  "booking.total": "Total",
  "booking.confirm": "Confirmer la réservation",
  "booking.sending": "Envoi…",
  "booking.success": "Réservation enregistrée. WhatsApp s'ouvre avec le récapitulatif.",
  "booking.errorFields": "Merci de remplir tous les champs et de choisir au moins une heure.",
  "booking.errorSave": "Impossible d'enregistrer la réservation. Réessayez.",
  "booking.dayBlocked": "Jour indisponible",
  "booking.hours": "heure(s)",
  "footer.role": "Professeur de guitare classique et de solfège, diplômé d'État",
  "footer.rights": "Tous droits réservés",
  "admin.title": "Espace administrateur",
  "admin.email": "E-mail",
  "admin.password": "Mot de passe",
  "admin.signin": "Se connecter",
  "admin.signup": "Créer le compte administrateur",
  "admin.signout": "Se déconnecter",
  "admin.bookingsOn": "Réservations du",
  "admin.none": "Aucune réservation ce jour.",
  "admin.new": "+ Nouvelle réservation",
  "admin.blockDay": "Jour indisponible",
  "admin.unblockDay": "Rendre le jour disponible",
  "admin.blockHours": "Bloquer les heures sélectionnées",
  "admin.unblockHours": "Débloquer les heures sélectionnées",
  "admin.edit": "Modifier",
  "admin.delete": "Supprimer",
  "admin.save": "Enregistrer",
  "admin.cancel": "Annuler",
  "admin.saved": "Enregistré",
  "admin.deleted": "Réservation supprimée",
  "admin.denied": "Ce compte n'est pas administrateur.",
};

const en: Dict = {
  "nav.videos": "Videos",
  "nav.teaching": "Teaching",
  "nav.booking": "Booking",
  "nav.contact": "Contact",
  "hero.kicker": "Private classical guitar lessons",
  "hero.title": "State-certified teacher, dual-degree holder in music theory and guitar",
  "hero.tagline":
    "Patient, demanding teaching built around tone, gesture and the pleasure of playing.",
  "hero.book": "Book a session",
  "hero.whatsapp": "WhatsApp",
  "videos.title": "In music",
  "videos.subtitle": "A few excerpts of playing and teaching.",
  "videos.empty": "Video coming soon",
  "teaching.title": "One method, four paths",
  "teaching.kids": "Kids",
  "teaching.kidsText": "Musical awakening through play: rhythm, listening, first strings.",
  "teaching.teens": "Teenagers",
  "teaching.teensText": "Engaging repertoire and exam preparation.",
  "teaching.adults": "Adults",
  "teaching.adultsText": "Flexible lessons that fit a busy schedule.",
  "teaching.seniors": "Seniors",
  "teaching.seniorsText": "Calm pace, no performance pressure.",
  "teaching.langs": "Lessons available in: French, English, Spanish, Arabic",
  "booking.title": "Book a lesson",
  "booking.level": "Level",
  "booking.beginner": "Beginner (Solfège / Guitar)",
  "booking.intermediate": "Intermediate (Guitar)",
  "booking.perHour": "DH / hour",
  "booking.pickDate": "Choose a date",
  "booking.pickHours": "Choose your hours",
  "booking.pickDateFirst": "Pick a date first.",
  "booking.taken": "Unavailable",
  "booking.name": "Full name",
  "booking.phone": "Phone number",
  "booking.total": "Total",
  "booking.confirm": "Confirm booking",
  "booking.sending": "Sending…",
  "booking.success": "Booking saved. WhatsApp opens with the summary.",
  "booking.errorFields": "Please fill every field and pick at least one hour.",
  "booking.errorSave": "Could not save the booking. Please try again.",
  "booking.dayBlocked": "Day unavailable",
  "booking.hours": "hour(s)",
  "footer.role": "State-certified classical guitar and music theory teacher",
  "footer.rights": "All rights reserved",
  "admin.title": "Admin area",
  "admin.email": "Email",
  "admin.password": "Password",
  "admin.signin": "Sign in",
  "admin.signup": "Create the admin account",
  "admin.signout": "Sign out",
  "admin.bookingsOn": "Bookings on",
  "admin.none": "No booking that day.",
  "admin.new": "+ New booking",
  "admin.blockDay": "Day unavailable",
  "admin.unblockDay": "Make the day available",
  "admin.blockHours": "Block selected hours",
  "admin.unblockHours": "Unblock selected hours",
  "admin.edit": "Edit",
  "admin.delete": "Delete",
  "admin.save": "Save",
  "admin.cancel": "Cancel",
  "admin.saved": "Saved",
  "admin.deleted": "Booking deleted",
  "admin.denied": "This account is not the administrator.",
};

const es: Dict = {
  "nav.videos": "Vídeos",
  "nav.teaching": "Enseñanza",
  "nav.booking": "Reserva",
  "nav.contact": "Contacto",
  "hero.kicker": "Clases particulares de guitarra clásica",
  "hero.title": "Profesor titulado del Estado, doble titulación en solfeo y guitarra",
  "hero.tagline":
    "Una pedagogía paciente y exigente, centrada en el sonido, el gesto y el placer de tocar.",
  "hero.book": "Reservar una clase",
  "hero.whatsapp": "WhatsApp",
  "videos.title": "En música",
  "videos.subtitle": "Algunos extractos tocando y enseñando.",
  "videos.empty": "Vídeo próximamente",
  "teaching.title": "Un método, cuatro caminos",
  "teaching.kids": "Niños",
  "teaching.kidsText": "Despertar musical mediante el juego: ritmo, escucha, primeras cuerdas.",
  "teaching.teens": "Adolescentes",
  "teaching.teensText": "Repertorio motivador y preparación de exámenes.",
  "teaching.adults": "Adultos",
  "teaching.adultsText": "Clases flexibles, adaptadas a agendas ocupadas.",
  "teaching.seniors": "Mayores",
  "teaching.seniorsText": "Ritmo tranquilo, sin presión de rendimiento.",
  "teaching.langs": "Clases disponibles en: francés, inglés, español, árabe",
  "booking.title": "Reservar",
  "booking.level": "Nivel",
  "booking.beginner": "Principiante (Solfeo / Guitarra)",
  "booking.intermediate": "Intermedio (Guitarra)",
  "booking.perHour": "DH / hora",
  "booking.pickDate": "Elige una fecha",
  "booking.pickHours": "Elige tus horas",
  "booking.pickDateFirst": "Elige primero una fecha.",
  "booking.taken": "No disponible",
  "booking.name": "Nombre completo",
  "booking.phone": "Teléfono",
  "booking.total": "Total",
  "booking.confirm": "Confirmar la reserva",
  "booking.sending": "Enviando…",
  "booking.success": "Reserva guardada. WhatsApp se abre con el resumen.",
  "booking.errorFields": "Completa todos los campos y elige al menos una hora.",
  "booking.errorSave": "No se pudo guardar la reserva. Inténtalo de nuevo.",
  "booking.dayBlocked": "Día no disponible",
  "booking.hours": "hora(s)",
  "footer.role": "Profesor titulado de guitarra clásica y solfeo",
  "footer.rights": "Todos los derechos reservados",
  "admin.title": "Área de administración",
  "admin.email": "Correo",
  "admin.password": "Contraseña",
  "admin.signin": "Iniciar sesión",
  "admin.signup": "Crear la cuenta de administrador",
  "admin.signout": "Cerrar sesión",
  "admin.bookingsOn": "Reservas del",
  "admin.none": "Ninguna reserva ese día.",
  "admin.new": "+ Nueva reserva",
  "admin.blockDay": "Día no disponible",
  "admin.unblockDay": "Hacer el día disponible",
  "admin.blockHours": "Bloquear las horas seleccionadas",
  "admin.unblockHours": "Desbloquear las horas seleccionadas",
  "admin.edit": "Editar",
  "admin.delete": "Eliminar",
  "admin.save": "Guardar",
  "admin.cancel": "Cancelar",
  "admin.saved": "Guardado",
  "admin.deleted": "Reserva eliminada",
  "admin.denied": "Esta cuenta no es la de administrador.",
};

const ar: Dict = {
  "nav.videos": "فيديوهات",
  "nav.teaching": "التدريس",
  "nav.booking": "الحجز",
  "nav.contact": "اتصال",
  "hero.kicker": "دروس خصوصية في الغيتار الكلاسيكي",
  "hero.title": "أستاذ مجاز من الدولة، حاصل على شهادتين في الصولفيج والغيتار",
  "hero.tagline": "تعليم صبور ودقيق، يقوم على الصوت والحركة ومتعة العزف.",
  "hero.book": "احجز حصة",
  "hero.whatsapp": "واتساب",
  "videos.title": "مقاطع موسيقية",
  "videos.subtitle": "مقتطفات من العزف والدروس.",
  "videos.empty": "فيديو قريباً",
  "teaching.title": "منهج واحد، أربعة مسارات",
  "teaching.kids": "الأطفال",
  "teaching.kidsText": "إيقاظ موسيقي عبر اللعب: الإيقاع، الإنصات، الأوتار الأولى.",
  "teaching.teens": "المراهقون",
  "teaching.teensText": "ذخيرة محفّزة وتحضير للامتحانات.",
  "teaching.adults": "الكبار",
  "teaching.adultsText": "دروس مرنة تناسب جداول العمل.",
  "teaching.seniors": "كبار السن",
  "teaching.seniorsText": "إيقاع هادئ، دون ضغط الأداء.",
  "teaching.langs": "الدروس متوفرة بـ: الفرنسية، الإنجليزية، الإسبانية، العربية",
  "booking.title": "الحجز",
  "booking.level": "المستوى",
  "booking.beginner": "مبتدئ (صولفيج / غيتار)",
  "booking.intermediate": "متوسط (غيتار)",
  "booking.perHour": "درهم / ساعة",
  "booking.pickDate": "اختر تاريخاً",
  "booking.pickHours": "اختر الساعات",
  "booking.pickDateFirst": "اختر التاريخ أولاً.",
  "booking.taken": "غير متاح",
  "booking.name": "الاسم الكامل",
  "booking.phone": "رقم الهاتف",
  "booking.total": "المجموع",
  "booking.confirm": "تأكيد الحجز",
  "booking.sending": "جارٍ الإرسال…",
  "booking.success": "تم حفظ الحجز. سيفتح واتساب بالملخص.",
  "booking.errorFields": "يرجى ملء جميع الحقول واختيار ساعة واحدة على الأقل.",
  "booking.errorSave": "تعذّر حفظ الحجز. حاول مجدداً.",
  "booking.dayBlocked": "يوم غير متاح",
  "booking.hours": "ساعة/ساعات",
  "footer.role": "أستاذ الغيتار الكلاسيكي والصولفيج، مجاز من الدولة",
  "footer.rights": "جميع الحقوق محفوظة",
  "admin.title": "فضاء المشرف",
  "admin.email": "البريد الإلكتروني",
  "admin.password": "كلمة المرور",
  "admin.signin": "تسجيل الدخول",
  "admin.signup": "إنشاء حساب المشرف",
  "admin.signout": "تسجيل الخروج",
  "admin.bookingsOn": "حجوزات يوم",
  "admin.none": "لا حجوزات في هذا اليوم.",
  "admin.new": "+ حجز جديد",
  "admin.blockDay": "يوم غير متاح",
  "admin.unblockDay": "إتاحة اليوم",
  "admin.blockHours": "حظر الساعات المحددة",
  "admin.unblockHours": "رفع الحظر عن الساعات المحددة",
  "admin.edit": "تعديل",
  "admin.delete": "حذف",
  "admin.save": "حفظ",
  "admin.cancel": "إلغاء",
  "admin.saved": "تم الحفظ",
  "admin.deleted": "تم حذف الحجز",
  "admin.denied": "هذا الحساب ليس حساب المشرف.",
};

const DICTS: Record<Lang, Dict> = { fr, en, es, ar };

export const LOCALES: Record<Lang, string> = {
  fr: "fr-FR",
  en: "en-GB",
  es: "es-ES",
  ar: "ar-MA",
};

type I18nValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
  locale: string;
};

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");

  useEffect(() => {
    const stored = localStorage.getItem("lang") as Lang | null;
    if (stored && DICTS[stored]) setLangState(stored);
  }, []);

  useEffect(() => {
    const dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.setAttribute("dir", dir);
    document.documentElement.setAttribute("lang", lang);
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("lang", l);
  };

  const value: I18nValue = {
    lang,
    setLang,
    t: (key) => DICTS[lang][key] ?? DICTS.en[key] ?? key,
    dir: lang === "ar" ? "rtl" : "ltr",
    locale: LOCALES[lang],
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
