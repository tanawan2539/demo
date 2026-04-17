export type Lang = "en" | "th";

const translations = {
  en: {
    nav: {
      brokers: "Brokers",
      submitBroker: "Submit Broker",
      manage: "Manage",
    },
    home: {
      title: "Institutional Brokers",
      subtitle:
        "Access global liquidity through our curated network of elite financial institutions and market makers.",
    },
    submitPage: {
      title: "Submit Broker",
      subtitle:
        "Register a new institutional entity within the Woxa ecosystem.",
      subtitleSub:
        "Please ensure all data points align with regulatory documentation.",
    },
    filter: {
      placeholder: "Find brokers by name, Slug",
      assetFocus: "Asset Focus:",
      all: "All Partners",
    },
    card: {
      viewDetails: "View Details",
      typeLabel: {
        cfd: "TIER 1 LICENSED",
        bond: "FCA REGULATED",
        stock: "LOCAL REACH",
        crypto: "CRYPTO CERTIFIED",
      } as Record<string, string>,
      typeBadge: {
        cfd: "PREMIUM TIER",
        bond: "FIXED INCOME",
        stock: "EQUITY",
        crypto: "DIGITAL ASSET",
      } as Record<string, string>,
    },
    scroll: {
      noResults: "No brokers found",
      noResultsHint: "Try adjusting your search or filter criteria",
      loading: "Loading more...",
      end: "— End of results —",
    },
    form: {
      brokerName: "Broker Name",
      slug: "Slug",
      brokerType: "Broker Type",
      logoUrl: "Logo URL",
      website: "Website",
      description: "Broker Description",
      discard: "Discard Draft",
      submit: "Submit Application",
      submitting: "Submitting...",
    },
    footer: {
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      risk: "Risk Disclosure",
      contact: "Contact",
      rights: "© 2024 Woxa. All rights reserved.",
    },
  },
  th: {
    nav: {
      brokers: "โบรกเกอร์",
      submitBroker: "เพิ่มโบรกเกอร์",
      manage: "จัดการ",
    },
    home: {
      title: "โบรกเกอร์สถาบัน",
      subtitle:
        "เข้าถึงสภาพคล่องทั่วโลกผ่านเครือข่ายสถาบันการเงินและผู้ดูแลสภาพคล่องชั้นนำของเรา",
    },
    submitPage: {
      title: "เพิ่มโบรกเกอร์",
      subtitle: "ลงทะเบียนสถาบันใหม่ในระบบ Woxa",
      subtitleSub: "กรุณาตรวจสอบให้แน่ใจว่าข้อมูลสอดคล้องกับเอกสารกำกับดูแล",
    },
    filter: {
      placeholder: "ค้นหาโบรกเกอร์ด้วยชื่อหรือ Slug",
      assetFocus: "ประเภทสินทรัพย์:",
      all: "ทั้งหมด",
    },
    card: {
      viewDetails: "ดูรายละเอียด",
      typeLabel: {
        cfd: "ใบอนุญาตระดับ 1",
        bond: "กำกับโดย FCA",
        stock: "ตลาดในประเทศ",
        crypto: "รับรองคริปโต",
      } as Record<string, string>,
      typeBadge: {
        cfd: "ระดับพรีเมียม",
        bond: "รายได้คงที่",
        stock: "หุ้น",
        crypto: "สินทรัพย์ดิจิทัล",
      } as Record<string, string>,
    },
    scroll: {
      noResults: "ไม่พบโบรกเกอร์",
      noResultsHint: "ลองปรับเงื่อนไขการค้นหาหรือตัวกรอง",
      loading: "กำลังโหลดเพิ่มเติม...",
      end: "— สิ้นสุดผลลัพธ์ —",
    },
    form: {
      brokerName: "ชื่อโบรกเกอร์",
      slug: "Slug",
      brokerType: "ประเภทโบรกเกอร์",
      logoUrl: "URL โลโก้",
      website: "เว็บไซต์",
      description: "รายละเอียดโบรกเกอร์",
      discard: "ยกเลิกร่าง",
      submit: "ส่งใบสมัคร",
      submitting: "กำลังส่ง...",
    },
    footer: {
      privacy: "นโยบายความเป็นส่วนตัว",
      terms: "ข้อกำหนดการใช้งาน",
      risk: "การเปิดเผยความเสี่ยง",
      contact: "ติดต่อ",
      rights: "© 2024 Woxa. สงวนลิขสิทธิ์",
    },
  },
} as const;

export type Translations = (typeof translations)["en"];
export default translations;
