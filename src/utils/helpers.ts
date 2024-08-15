export const { format } = new Intl.DateTimeFormat("pt-br", {
  dateStyle: "short",
});

export function formatPhoneNumber(phoneNumber: string): string {
  const cleaned = phoneNumber.replace(/\D/g, "");

  if (cleaned.length < 10) {
    throw new Error("Número de telefone inválido");
  }

  const formatted = cleaned.replace(/^(\d{2})(\d{4,5})(\d{4})$/, "($1) $2-$3");
  return formatted;
}
