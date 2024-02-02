export type TPostCurrencyResponse = {
  id: number
  name: string
  symbol: string
  side: string
  main: boolean
}

export type TPostOrganizationResponse = {
  id: number
  name: string
  address: string
  additional_info: string
  phone_number: string
  currency: number | null
}

export type TPostWarehouseTypesResponse = {
  id: number
  name: string
  order_number: number
  status: boolean
}
