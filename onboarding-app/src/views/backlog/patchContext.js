/* The Before / After switch, shared between the browser that owns it and the
   patches that read it. Its own module so neither file exports a value
   alongside its components. */

import { createContext, useContext } from 'react';

export const PatchContext = createContext(true);
export const usePatched = () => useContext(PatchContext);
