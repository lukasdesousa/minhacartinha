export const MAX_LOVE_VOUCHERS = 10;
export const MIN_LOVE_WHEEL_OPTIONS = 2;
export const MAX_LOVE_WHEEL_OPTIONS = 12;
export const ROMANTIC_TITLE_MAX_LENGTH = 80;
export const ROMANTIC_DESCRIPTION_MAX_LENGTH = 180;

export type LoveVoucherInput = {
  id: string;
  title: string;
  description: string;
  totalUses: 1 | 2 | 3 | null;
};

export type LoveWheelOptionInput = {
  id: string;
  title: string;
  description: string;
};

const ID_PATTERN = /^[A-Za-z0-9_-]{1,64}$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function text(value: unknown, label: string, required: boolean) {
  if (typeof value !== "string") throw new Error(`${label} é inválido.`);
  const result = value.trim();
  if (required && !result) throw new Error(`${label} é obrigatório.`);
  if (result.length > ROMANTIC_TITLE_MAX_LENGTH && label.includes("título")) {
    throw new Error(`${label} ultrapassa ${ROMANTIC_TITLE_MAX_LENGTH} caracteres.`);
  }
  if (result.length > ROMANTIC_DESCRIPTION_MAX_LENGTH && label.includes("descrição")) {
    throw new Error(`${label} ultrapassa ${ROMANTIC_DESCRIPTION_MAX_LENGTH} caracteres.`);
  }
  return result;
}

function itemId(value: unknown) {
  if (typeof value !== "string" || !ID_PATTERN.test(value)) throw new Error("Um identificador romântico é inválido.");
  return value;
}

export function parseLoveVouchers(value: unknown, enabled: boolean): LoveVoucherInput[] {
  if (!Array.isArray(value)) throw new Error("Os Vales do Amor são inválidos.");
  if (value.length > MAX_LOVE_VOUCHERS) throw new Error(`Adicione no máximo ${MAX_LOVE_VOUCHERS} Vales do Amor.`);
  if (enabled && value.length < 1) throw new Error("Adicione pelo menos um Vale do Amor.");
  const seen = new Set<string>();
  return value.map((item) => {
    if (!isRecord(item)) throw new Error("Um Vale do Amor é inválido.");
    const id = itemId(item.id);
    if (seen.has(id)) throw new Error("Há Vales do Amor duplicados.");
    seen.add(id);
    const totalUses = item.totalUses;
    if (totalUses !== null && totalUses !== 1 && totalUses !== 2 && totalUses !== 3) {
      throw new Error("Escolha 1, 2, 3 usos ou uso ilimitado para cada vale.");
    }
    return {
      id,
      title: text(item.title, "O título do vale", enabled),
      description: text(item.description ?? "", "A descrição do vale", false),
      totalUses,
    };
  });
}

export function parseLoveWheelOptions(value: unknown, enabled: boolean): LoveWheelOptionInput[] {
  if (!Array.isArray(value)) throw new Error("As opções da Roleta do Amor são inválidas.");
  if (value.length > MAX_LOVE_WHEEL_OPTIONS) throw new Error(`Adicione no máximo ${MAX_LOVE_WHEEL_OPTIONS} opções à Roleta do Amor.`);
  if (enabled && value.length < MIN_LOVE_WHEEL_OPTIONS) throw new Error(`Adicione pelo menos ${MIN_LOVE_WHEEL_OPTIONS} opções à Roleta do Amor.`);
  const ids = new Set<string>();
  const titles = new Set<string>();
  return value.map((item) => {
    if (!isRecord(item)) throw new Error("Uma opção da Roleta do Amor é inválida.");
    const id = itemId(item.id);
    if (ids.has(id)) throw new Error("Há opções duplicadas na Roleta do Amor.");
    ids.add(id);
    const title = text(item.title, "O título da opção da roleta", enabled);
    const normalizedTitle = title.toLocaleLowerCase("pt-BR");
    if (title && titles.has(normalizedTitle)) throw new Error("A Roleta do Amor não aceita opções com o mesmo título.");
    if (title) titles.add(normalizedTitle);
    return {
      id,
      title,
      description: text(item.description ?? "", "A descrição da opção da roleta", false),
    };
  });
}

export function getRomanticFeaturesError(input: {
  vouchersEnabled: boolean;
  vouchers: unknown;
  loveWheelEnabled: boolean;
  loveWheelOptions: unknown;
}) {
  try {
    parseLoveVouchers(input.vouchers, input.vouchersEnabled);
    parseLoveWheelOptions(input.loveWheelOptions, input.loveWheelEnabled);
    return "";
  } catch (error) {
    return error instanceof Error ? error.message : "Os recursos românticos são inválidos.";
  }
}

export function secureRandomIndex(length: number, randomBytes = crypto.getRandomValues(new Uint32Array(1))) {
  if (!Number.isSafeInteger(length) || length < 1) throw new Error("A roleta não possui opções válidas.");
  const range = 0x1_0000_0000;
  const limit = range - (range % length);
  let value = randomBytes[0];
  while (value >= limit) value = crypto.getRandomValues(new Uint32Array(1))[0];
  return value % length;
}
