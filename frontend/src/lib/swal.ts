import Swal from "sweetalert2";

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

export async function confirmDelete(name: string): Promise<boolean> {
  const result = await MySwal.fire({
    title: "Delete Broker?",
    html: `<span style="color:#94a3b8">Are you sure you want to delete <strong style="color:#e2e8f0">${name}</strong>?<br/>This action cannot be undone.</span>`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#dc2626",
    reverseButtons: true,
  });
  return result.isConfirmed;
}

export function alertSuccess(message: string) {
  return MySwal.fire({
    icon: "success",
    title: message,
    showConfirmButton: true,
    confirmButtonText: "OK",
    timer: 2500,
    timerProgressBar: true,
  });
}

export default MySwal;
