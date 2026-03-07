// Config type definitions
import { NextFontWithVariable } from "next/dist/compiled/@next/font";

export type DisplayConfig = {
  location: boolean;
  time: boolean;
  themeSwitcher: boolean;
};

export type RoutesConfig = Record<`/${string}`, boolean>;
export type ProtectedRoutesConfig = Record<`/${string}`, boolean>;

export type FontsConfig = {
  heading: NextFontWithVariable;
  body: NextFontWithVariable;
  label: NextFontWithVariable;
  code: NextFontWithVariable;
};

export type StyleConfig = {
  theme: string;
  neutral: string;
  brand: string;
  accent: string;
  solid: string;
  solidStyle: string;
  border: string;
  surface: string;
  transition: string;
  scaling: string;
};

export type DataStyleConfig = {
  variant: string;
  mode: string;
  height: number;
  axis: { stroke: string };
  tick: { fill: string; fontSize: number; line: boolean };
};

export type EffectsConfig = {
  mask: { cursor: boolean; x: number; y: number; radius: number };
  gradient: { display: boolean; opacity: number; x: number; y: number; width: number; height: number; tilt: number; colorStart: string; colorEnd: string };
  dots: { display: boolean; opacity: number; size: string; color: string };
  grid: { display: boolean; opacity: number; color: string; width: string; height: string };
  lines: { display: boolean; opacity: number; color: string; size: string; thickness: number; angle: number };
};

export type MailchimpConfig = {
  action: string;
  effects: EffectsConfig;
};

export type SchemaConfig = {
  logo: string;
  type: string;
  name: string;
  description: string;
  email: string;
};

export type SameAsConfig = {
  threads: string;
  linkedin: string;
  discord: string;
};

export type SocialSharingConfig = {
  display: boolean;
  platforms: {
    x: boolean;
    linkedin: boolean;
    facebook: boolean;
    pinterest: boolean;
    whatsapp: boolean;
    reddit: boolean;
    telegram: boolean;
    email: boolean;
    copyLink: boolean;
  };
};

export type OnceUIConfig = {
  display: DisplayConfig;
  mailchimp: MailchimpConfig;
  routes: RoutesConfig;
  protectedRoutes: ProtectedRoutesConfig;
  baseURL: string;
  fonts: FontsConfig;
  style: StyleConfig;
  schema: SchemaConfig;
  sameAs: SameAsConfig;
  socialSharing: SocialSharingConfig;
  effects: EffectsConfig;
  dataStyle: DataStyleConfig;
};
