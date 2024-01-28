export interface StatisticsObj {
  [key: string]: number
}

export interface Statistics {
  low_stock: Array<string>
  out_of_stock: Array<string>
  sales: StatisticsObj
  revenue: Array<StatisticsObj>
  profit: Array<StatisticsObj>
}

export interface DateRange {
  start_date: string | undefined
  end_date: string | undefined
  frequency: string | undefined
}
