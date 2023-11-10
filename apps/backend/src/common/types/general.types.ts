export type ObjectLiteral = { [key: string]: any };

export type authenticatedUser = {
  user: {userId: string, username: string};
  [key: string]: any
};