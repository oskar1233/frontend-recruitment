import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import { PillsApp } from "./01-pills/PillsApp";
import { WidgetApp } from "./02-widget/WidgetApp";
import { IframeApp } from "./02-widget/IframeApp";

const router = createBrowserRouter(
  createRoutesFromElements([
    <Route path="pills" element={<PillsApp />} />,
    <Route path="widget" element={<WidgetApp />} />,
    <Route path="iframe" element={<IframeApp />} />,
  ])
);

export const Router = () => {
  return <RouterProvider router={router} />;
};
