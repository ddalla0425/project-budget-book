type CalcType = 'SUM' | 'AVG' | 'COUNT' | 'MAX' | 'MIN';

export const calculateData = <T>(
  data: T[],
  key: keyof T,
  type: CalcType = 'SUM'
): number => {
  const values = data.map(item => Number(item[key])).filter(val => !isNaN(val));

  if (values.length === 0) return 0;

  switch (type) {
    case 'SUM': return values.reduce((acc, cur) => acc + cur, 0);
    case 'AVG': return values.reduce((acc, cur) => acc + cur, 0) / values.length;
    case 'MAX': return Math.max(...values);
    case 'MIN': return Math.min(...values);
    case 'COUNT': return values.length;
    default: return 0;
  }
};