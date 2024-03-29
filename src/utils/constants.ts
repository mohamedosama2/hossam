import { UserRole } from "src/users/models/_user.model";

export class Constants {
   public static readonly MessageQueues = {
    TEST: 'test',
    TEST1: 'test1',
  };

  public static readonly GET_POSTS_CACHE_KEY = 'GET_POSTS_CACHE';
  public static readonly EMAIL_REGX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  public static readonly PHONE_REGX = /\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{1,14}$/;
 /*  public static readonly USER_ROLE_REGX = RegExp(`^${Object.values(UserRole).filter(v => typeof v !== "number").join('|')}$`); */
}
