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
    swal: {
      deleteTitle: "Delete Broker?",
      deleteHtml: (name: string) =>
        `<span style="color:#94a3b8">Are you sure you want to delete <strong style="color:#e2e8f0">${name}</strong>?<br/>This action cannot be undone.</span>`,
      deleteConfirm: "Yes, delete",
      deleteCancel: "Cancel",
      deleted: "Deleted successfully",
      updated: "Broker updated successfully",
      submitted: "Broker submitted successfully!",
      ok: "OK",
    },
    manage: {
      title: "Manage Brokers",
      subtitle: "View, edit and delete broker listings",
      addBroker: "Add Broker",
    },
    table: {
      search: "Search...",
      noRecords: "No records found",
      page: "Page",
      of: "of",
      edit: "Edit",
      delete: "Delete",
      headers: ["#", "Name", "Slug", "Type", "Website", "Created", "Actions"] as string[],
    },
    modal: {
      title: "Edit Broker",
      name: "Name",
      slug: "Slug",
      brokerType: "Broker Type",
      logoUrl: "Logo URL",
      website: "Website",
      description: "Description",
      cancel: "Cancel",
      save: "Save Changes",
      saving: "Saving...",
    },
    detail: {
      back: "Back to Brokers",
      about: "About",
      listed: "Listed:",
      typeLabel: {
        cfd: "Tier 1 Licensed",
        bond: "FCA Regulated",
        stock: "Local Reach",
        crypto: "Crypto Certified",
      } as Record<string, string>,
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
    swal: {
      deleteTitle: "ลบโบรกเกอร์?",
      deleteHtml: (name: string) =>
        `<span style="color:#94a3b8">คุณแน่ใจหรือไม่ที่จะลบ <strong style="color:#e2e8f0">${name}</strong>?<br/>การกระทำนี้ไม่สามารถย้อนกลับได้</span>`,
      deleteConfirm: "ใช่ ลบเลย",
      deleteCancel: "ยกเลิก",
      deleted: "ลบสำเร็จ",
      updated: "อัปเดตโบรกเกอร์สำเร็จ",
      submitted: "เพิ่มโบรกเกอร์สำเร็จ!",
      ok: "ตกลง",
    },
    manage: {
      title: "จัดการโบรกเกอร์",
      subtitle: "ดู แก้ไข และลบรายการโบรกเกอร์",
      addBroker: "เพิ่มโบรกเกอร์",
    },
    table: {
      search: "ค้นหา...",
      noRecords: "ไม่พบข้อมูล",
      page: "หน้า",
      of: "จาก",
      edit: "แก้ไข",
      delete: "ลบ",
      headers: ["#", "ชื่อ", "Slug", "ประเภท", "เว็บไซต์", "วันที่สร้าง", "จัดการ"] as string[],
    },
    modal: {
      title: "แก้ไขโบรกเกอร์",
      name: "ชื่อ",
      slug: "Slug",
      brokerType: "ประเภทโบรกเกอร์",
      logoUrl: "URL โลโก้",
      website: "เว็บไซต์",
      description: "รายละเอียด",
      cancel: "ยกเลิก",
      save: "บันทึกการเปลี่ยนแปลง",
      saving: "กำลังบันทึก...",
    },
    detail: {
      back: "กลับสู่รายการโบรกเกอร์",
      about: "เกี่ยวกับ",
      listed: "วันที่ลงทะเบียน:",
      typeLabel: {
        cfd: "ใบอนุญาตระดับ 1",
        bond: "กำกับโดย FCA",
        stock: "ตลาดในประเทศ",
        crypto: "รับรองคริปโต",
      } as Record<string, string>,
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
