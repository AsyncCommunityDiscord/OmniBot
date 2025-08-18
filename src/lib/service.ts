import { DeclarationType, type Declared } from "./declared.js";

export interface Service {}

export function declareService<T extends Service>(service: T): Declared<T> {
  const declaredService = service;
  // @ts-ignore
  declaredService.type = DeclarationType.Service;

  return declaredService as Declared<T>;
}
