import { Statement } from "../../entities/Statement";

export type ICreateTransferDTO =
Pick<
  Statement,
  'user_id' |
  'send_id' |
  'description' |
  'amount'
>
