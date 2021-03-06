import { Statement } from "../../entities/Statement";

export type ICreateStatementDTO =
Pick<
  Statement,
  'user_id' |
  'send_id' |
  'description' |
  'amount' |
  'type'
>
