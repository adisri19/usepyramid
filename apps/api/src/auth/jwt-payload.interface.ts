export class JwtPayload {
  sub: string;
  email?: string;
  workspaceId: string;
  isGuest: boolean;
}
