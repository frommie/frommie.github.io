// schemas/index.ts

import micro from "./microType";
import photo from "./photoType";
import article from "./articleType";
import siteSettings from './siteSettings'
import now from "./nowType";

export const schemaTypes = [micro, photo, article, siteSettings, now];