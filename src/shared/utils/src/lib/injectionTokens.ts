import { Inject, InjectionToken } from '@angular/core';

export const SUCCESS_MESSAGE_TOKEN = new InjectionToken<string>(
  'SUCCESS_MESSAGE_TOKEN'
);

export const ERROR_MESSAGE_TOKEN = new InjectionToken<string>(
  'ERROR_MESSAGE_TOKEN'
);
