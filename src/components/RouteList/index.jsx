import { Link, createSearchParams } from 'react-router-dom';

export function RouteList(props) {
  const { data, currentTab, setCurrentTab, showRouteList, handleRouteList, error, isLoading } =
    props;

  function onClickHandleShowForm(route) {
    setCurrentTab({ ...currentTab, route: route });
  }

  const renderError = () => {
    return <div>Cant fetch routes</div>;
  };

  const renderOkay = (input) => {
    return input
      .filter((route) => route.serviceId === currentTab.service.id)
      .map((route) =>
        route.paths.map((path) => {
          const routeInfo = route.id + (route.name ? ` ${route.name}` : '') + `: ${path}`;
          const subRoute = { ...route, paths: path };
          return (
            <li key={route.id}>
              {routeInfo}
              <button onClick={() => onClickHandleShowForm(subRoute)}>
                <Link
                  to={{
                    pathname: '/form',
                    search: createSearchParams({
                      serviceId: currentTab.service.id,
                      routePath: path
                    }).toString()
                  }}
                  state={{
                    ...currentTab,
                    route: subRoute
                  }}>
                  select
                </Link>
              </button>
            </li>
          );
        })
      );
  };

  const renderLoading = () => {
    return <div>Loading . .. . . .</div>;
  };

  const showHideRList = showRouteList ? 'modal display-block' : 'modal display-none';
  return (
    <>
      {showRouteList && (
        <div className={showHideRList}>
          <div className="modal-main">
            {isLoading ? renderLoading() : error ? renderError() : renderOkay(data)}
            <button onClick={(e) => handleRouteList(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}
