import ErrorPage from "pages/erros";
import AllUniversites from "pages/universities";
import UniversityDetails from "pages/universities/university";

const routes = [
  {
    path: "/",
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <AllUniversites />,
      },
      {
        path: ":universityName",
        element: <UniversityDetails />,
      },
    ],
  },
];

export default routes;
