import Swal from "sweetalert2";
import translations, { type Lang } from "./translations";

const MySwal = Swal.mixin({
  background: "#0f1e35",
  color: "#e2e8f0",
  confirmButtonColor: "#1e3f6e",
  cancelButtonColor: "transparent",
  customClass: {
    popup: "swal-popup",
    confirmButton: "swal-confirm",
    cancelButton: "swal-cancel",
    title: "swal-title",
    htmlContainer: "swal-html",
  },
});

function getLang(): Lang {
  if (typeof window === "undefined") return "en";
  return (localStorage.getItem("lang") as Lang) ?? "en";
}

export async function confirmDelete(name: string): Promise<boolean> {
  const t = translations[getLang()].swal;
  const result = await MySwal.fire({
    title: t.deleteTitle,
    html: t.deleteHtml(name),
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: t.deleteConfirm,
    cancelButtonText: t.deleteCancel,
    confirmButtonColor: "#dc2626",
    reverseButtons: true,
  });
  return result.isConfirmed;
}

export function alertSuccess(key: "deleted" | "updated" | "submitted") {
  const t = translations[getLang()].swal;
  return MySwal.fire({
    icon: "success",
    title: t[key],
    showConfirmButton: true,
    confirmButtonText: t.ok,
    timer: 2500,
    timerProgressBar: true,
  });
}

export default MySwal;
