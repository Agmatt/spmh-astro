/// <reference path="../.astro/types.d.ts" />

declare namespace App {
  interface Locals {
    user?: {
      id: string;
      email?: string;
    };
    cqiRole?: 'cqi_admin' | 'cqi_viewer';
  }
}
