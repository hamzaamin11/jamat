import { BrowserRouter as Routers, Routes, Route } from "react-router-dom";
// import { Login } from "./components/header/Login";
import { PrivateLayout } from "./components/HOC/PrivateLayout/PrivateLayout";

import { AddMember } from "./pages/AddMember";
import { MemberList } from "./pages/MemberList";
import { AddEvent } from "./pages/AddEvent";
import { EventList } from "./pages/EventList";
import { StartEvent } from "./pages/StartEvent";
import { MemberReport } from "./pages/MemberReport";
import { EventReport } from "./pages/EventReport";
import { PresentReport } from "./pages/PresentReport";
import { Zone } from "./pages/Zone";
import { District } from "./pages/District";
import { Login } from "./pages/Login";
import { PrivateRoute } from "./components/PrivateroutesHOC/PrivateRoute";
import { Dashboard } from "./pages/Dashboard";

function App() {
  return (
    <>
      <Routers>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<PrivateRoute />}>
            <Route
              path="/"
              element={
                <PrivateLayout>
                  <Dashboard />
                </PrivateLayout>
              }
            />
            <Route
              path="/registermember"
              element={
                <PrivateLayout>
                  <AddMember />
                </PrivateLayout>
              }
            />
            <Route
              path="/memberlist"
              element={
                <PrivateLayout>
                  <MemberList />
                </PrivateLayout>
              }
            />
            <Route
              path="/addevent"
              element={
                <PrivateLayout>
                  <AddEvent />
                </PrivateLayout>
              }
            />
            <Route
              path="/eventlist"
              element={
                <PrivateLayout>
                  <EventList />
                </PrivateLayout>
              }
            />
            <Route
              path="/startevent"
              element={
                <PrivateLayout>
                  <StartEvent />
                </PrivateLayout>
              }
            />
            <Route
              path="/registrationReport"
              element={
                <PrivateLayout>
                  <MemberReport />
                </PrivateLayout>
              }
            />
            <Route
              path="/eventReport"
              element={
                <PrivateLayout>
                  <EventReport />
                </PrivateLayout>
              }
            />
            <Route
              path="/presentReports"
              element={
                <PrivateLayout>
                  <PresentReport />
                </PrivateLayout>
              }
            />
            <Route
              path="/configuration"
              element={
                <PrivateLayout>
                  <District />
                </PrivateLayout>
              }
            />
            <Route
              path="/zone"
              element={
                <PrivateLayout>
                  <Zone />
                </PrivateLayout>
              }
            />
          </Route>
        </Routes>
      </Routers>
    </>
  );
}

export default App;
