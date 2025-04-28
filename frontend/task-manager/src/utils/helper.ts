export const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};


export const addThousandsSeparator = (num: number): string => {
  return num.toLocaleString('pt-BR');
};

  