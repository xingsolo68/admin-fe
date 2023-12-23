import React from "react";

export function ServiceList(props) {
  const {
    data,
    showServiceList,
    handleServiceList,
    handleRouteList,
    currentTab,
    setCurrentTab,
    error,
    isLoading
  } = props;
  
  function onClickHandleShowRoute(service) {
    handleServiceList(false);
    setCurrentTab({ ...currentTab, service: service });
    handleRouteList(true);
  }
  const showHideSList = showServiceList
    ? "modal display-block"
    : "modal display-none";

  const renderError = () => {
    return <div>Cant fetch services</div>;
  };

  const renderOkay = (input) => {
    return input.map((service) => (
      <li key={service.id}>
        {service.name}
        <button onClick={() => onClickHandleShowRoute(service)}>select</button>
      </li>
    ));
  };

  const renderLoading = () => {
    return <div>Loading . .. . . .</div>;
  };

  return (
    <>
      {showServiceList && (
        <div className={showHideSList}>
          <div className="modal-main">
            {isLoading
              ? renderLoading()
              : error
              ? renderError()
              : renderOkay(data)}
            <button
              onClick={(e) => {
                console.log(e);
                handleServiceList(false);
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}