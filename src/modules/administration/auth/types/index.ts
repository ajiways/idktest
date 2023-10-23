import { UserPayload } from "../../../../common/types";

export type UserPayloadWithRefreshToken = UserPayload & { refreshToken: string }
