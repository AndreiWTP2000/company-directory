/*Global Varaibles */
let searchTerm = "";
let departmentFilter = "";
let locationFilter = "";

/*Populate Location Table */
const getLocations = (searchTerm = "") => {
  $.ajax({
    url: "src/php/getAllLocations.php",
    type: "GET",
    dataType: "JSON",
    data: {
      searchTerm: searchTerm,
    },
    success: (result) => {
      if (result.status.name == "ok") {
        $("#locationTable").empty();
        result.data.forEach((location) => {
          $("#locationTable").append(
            `<tr id="locationID-${location.id}">
                <td id ='${location.id}'class="align-middle text-nowrap bg-light">${location.name}</td>
                <td class="align-middle text-end text-nowrap bg-light">
                <button
                type="button"
                class="btn btn-primary btn-sm"
                data-bs-toggle="modal"
                data-bs-target="#editLocationModal"
                data-id="${location.id}"
              >
                <i class="fa-solid fa-pencil fa-fw"></i>
              </button>
                  <button type="button" id="deleteLocationBtn" class="btn btn-primary btn-sm"  data-id="${location.id}" data-name="${location.name}">
                    <i class="fa-solid fa-trash fa-fw"></i>
                  </button>
                </td>
              </tr>`
          );
        });
      }
    },
  });
};

/*Populate Department Table */
const getDepartments = (searchTerm = "") => {
  $.ajax({
    url: "src/php/getAllDepartments.php",
    type: "GET",
    dataType: "JSON",
    data: {
      searchTerm: searchTerm,
    },
    success: (result) => {
      if (result.status.name == "ok") {
        $("#departmentTable").empty();
        result.data.forEach((department) => {
          $("#departmentTable").append(
            `<tr id='${department.id}'>
                <td id="${department.id}" class="align-middle text-nowrap bg-light">${department.name}</td>
                <td class="align-middle text-nowrap d-none d-md-table-cell bg-light"
                >
                ${department.location}
                </td>
                <td class="align-middle text-end text-nowrap bg-light">
                  <button
                    id="editPersonnelBtn"
                    type="button"
                    class="btn btn-primary btn-sm"
                    data-bs-toggle="modal"
                    data-bs-target="#editDepartmentModal"
                    data-id="${department.id}"
                  >
                    <i class="fa-solid fa-pencil fa-fw"></i>
                  </button>
                  <button
                    type="button"
                    id="deleteDepartmentBtn"
                    class="btn btn-primary btn-sm deleteDepartmentBtn"
                    data-id="${department.id}"
                    data-name="${department.name}"
                  >
                    <i class="fa-solid fa-trash fa-fw"></i>
                  </button>
                </td>
              </tr>`
          );
        });
      }
    },
  });
};

/*Populate Personnel Table */
const getPersonnel = (searchTerm, departmentFilter, locationFilter) => {
  $.ajax({
    url: "src/php/getAll.php",
    type: "GET",
    dataType: "JSON",
    data: {
      searchTerm: searchTerm,
      departmentFilter: departmentFilter,
      locationFilter: locationFilter,
    },
    success: (result) => {
      if (result.status.name == "ok") {
        $("#personnelTable").empty();
        for (let i = 0; i < result.data.length; i++) {
          $("#personnelTable").append(
            `<tr id='${result.data[i].id}'>
                  <td class="align-middle text-nowrap bg-light">${result.data[i].lastName}, ${result.data[i].firstName}</td>
                  <td
                    class="align-middle text-nowrap d-none d-md-table-cell bg-light"
                  >
                  ${result.data[i].department}
                  </td>
                  <td
                    class="align-middle text-nowrap d-none d-md-table-cell bg-light"
                  >
                  ${result.data[i].location}
                  </td>
                  <td
                    class="align-middle text-nowrap d-none d-md-table-cell bg-light"
                  >
                  ${result.data[i].email}
                  </td>
                  <td class="text-end text-nowrap bg-light">
                    <button
                      type="button"
                      class="btn btn-primary btn-sm"
                      data-bs-toggle="modal"
                      data-bs-target="#editPersonnelModal"
                      data-id="${result.data[i].id}"
                    >
                      <i class="fa-solid fa-pencil fa-fw"></i>
                    </button>
                    <button
                      type="button"
                      class="btn btn-primary btn-sm deletePersonnelBtn"
                      data-bs-toggle="modal"
                      data-bs-target="#deletePersonnelModal"
                      data-id="${result.data[i].id}"
                    >
                      <i class="fa-solid fa-trash fa-fw"></i>
                    </button>
                  </td>
                </tr>`
          );
        }
      }
      $(".spinner-wrapper")
        .delay(500)
        .fadeOut("slow", function () {
          $(this).remove();
        });
    },
    error: function () {
      alert("Error retrieving data. Reload the page and try again.");
      $(".spinner-wrapper")
        .delay(500)
        .fadeOut("slow", function () {
          $(this).remove();
        });
    },
  });
};
$(document).ready(function () {
  /*Populate Tables */
  getLocations();
  getDepartments();
  getPersonnel(searchTerm, departmentFilter, locationFilter);
});

/*-------------------------------------- */
/*Search Input */
$("#searchInp").on("keyup", function () {
  searchTerm = $("#searchInp").val();
  if ($("#personnelBtn").hasClass("active")) {
    getPersonnel(searchTerm, departmentFilter, locationFilter);
  } else {
    if ($("#departmentsBtn").hasClass("active")) {
      getDepartments(searchTerm);
    } else {
      getLocations(searchTerm);
    }
  }
});
/*Reset Personnel Function */
const resetPersonnel = () => {
  searchTerm = "";
  $("#filterPersonnelDepartment").val("");
  $("#filterPersonnelLocation").val("");
  departmentFilter = "";
  locationFilter = "";
  getPersonnel(searchTerm, departmentFilter, locationFilter);
};
/*Refresh Table and Input */
$("#refreshBtn").click(function () {
  $("#searchInp").val("");
  if ($("#personnelBtn").hasClass("active")) {
    resetPersonnel();
  } else {
    if ($("#departmentsBtn").hasClass("active")) {
      getDepartments();
    } else {
      getLocations();
    }
  }
});

$("#filterBtn").click(function () {
  // Open a modal of your own design that allows the user to apply a filter to the personnel table on either department or location
  if ($("#personnelBtn").hasClass("active")) {
    $("#filterPersonnelModal").modal("show");
  }
});

$("#filterPersonnelModal").on("show.bs.modal", function (e) {
  /*Filter Personnel Department Selelct*/
  $.ajax({
    url: "src/php/getAllDepartments.php",
    type: "GET",
    dataType: "JSON",
    data: {
      searchTerm: "",
    },
    success: (result) => {
      if (result.status.name == "ok") {
        $("#filterPersonnelDepartment")
          .empty()
          .append(
            $("<option>", {
              value: "",
              text: "All",
            })
          );
        result.data.forEach((department) => {
          $("#filterPersonnelDepartment").append(
            $("<option>", {
              value: department.name,
              text: department.name,
            })
          );
        });
        $("#filterPersonnelDepartment").val(departmentFilter);
      }
    },
  });
  /*Filter Personnel Location Selelct*/
  $.ajax({
    url: "src/php/getAllLocations.php",
    type: "GET",
    dataType: "JSON",
    data: {
      searchTerm: "",
    },
    success: (result) => {
      if (result.status.name == "ok") {
        $("#filterPersonnelLocation")
          .empty()
          .append(
            $("<option>", {
              value: "",
              text: "All",
            })
          );
        result.data.forEach((location) => {
          $("#filterPersonnelLocation").append(
            $("<option>", {
              value: location.name,
              text: location.name,
            })
          );
        });
        $("#filterPersonnelLocation").val(locationFilter);
      }
    },
  });
});

/*Filter department or Location */
$("#filterPersonnelDepartment").on("change", function () {
  $("#filterPersonnelLocation").val("");
});
$("#filterPersonnelLocation").on("change", function () {
  $("#filterPersonnelDepartment").val("");
});

$("#addBtn").click(function () {
  if ($("#personnelBtn").hasClass("active")) {
    $("#insertPersonnelModal").modal("show");
  } else {
    if ($("#departmentsBtn").hasClass("active")) {
      $("#insertDepartmentModal").modal("show");
    } else {
      $("#insertLocationModal").modal("show");
      $("#errorMessageLocationAdd").empty();
      $("#insertLocationName").val("");
    }
  }
});

$("#personnelBtn").click(function () {
  // Call function to refresh personnel table
  $("#searchInp").val("");
  resetPersonnel();
  $("#filterBtn").prop("disabled", false);
});

$("#departmentsBtn").click(function () {
  // Call function to refresh department table
  $("#searchInp").val("");
  getDepartments();
  $("#filterBtn").prop("disabled", true);
});

$("#locationsBtn").click(function () {
  // Call function to refresh location table
  $("#searchInp").val("");
  getLocations();
  $("#filterBtn").prop("disabled", true);
});
/*Edit Personnel */
$("#editPersonnelModal").on("show.bs.modal", function (e) {
  $.ajax({
    url: "src/php/getPersonnelByID.php",
    type: "POST",
    dataType: "json",
    data: {
      id: $(e.relatedTarget).attr("data-id"), // Retrieves the data-id attribute from the calling button
    },
    success: function (result) {
      var resultCode = result.status.code;
      if (resultCode == 200) {
        // Update the hidden input with the employee id so that
        // it can be referenced when the form is submitted

        $("#editPersonnelEmployeeID").val(result.data.personnel[0].id);

        $("#editPersonnelFirstName").val(result.data.personnel[0].firstName);
        $("#editPersonnelLastName").val(result.data.personnel[0].lastName);
        $("#editPersonnelJobTitle").val(result.data.personnel[0].jobTitle);
        $("#editPersonnelEmailAddress").val(result.data.personnel[0].email);

        $("#editPersonnelDepartment").html("");

        $.each(result.data.department, function () {
          $("#editPersonnelDepartment").append(
            $("<option>", {
              value: this.id,
              text: this.name,
            })
          );
        });

        $("#editPersonnelDepartment").val(
          result.data.personnel[0].departmentID
        );
      } else {
        $("#editPersonnelModal .modal-title").replaceWith(
          "Error retrieving data"
        );
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#editPersonnelModal .modal-title").replaceWith(
        "Error retrieving data"
      );
      alert("Error retrieving data");
    },
  });
});

// Executes when the form button with type="submit" is clicked
$("#editPersonnelForm").on("submit", function (e) {
  e.preventDefault();
  const id = $("#editPersonnelEmployeeID").val();
  const firstName = $("#editPersonnelFirstName").val();
  const lastName = $("#editPersonnelLastName").val();
  const jobTitle = $("#editPersonnelJobTitle").val();
  const email = $("#editPersonnelEmailAddress").val();
  const departmentID = $("#editPersonnelDepartment").val();

  const personnelFormData = {
    id,
    firstName,
    lastName,
    jobTitle,
    email,
    departmentID,
  };
  $.ajax({
    url: "src/php/editPersonnel.php",
    type: "POST",
    dataType: "json",
    data: {
      personnelFormData,
    },
    success: function (result) {
      var resultCode = result.status.code;
      if (resultCode == 200) {
        $("#editPersonnelModal").modal("hide");
        getPersonnel(searchTerm, departmentFilter, locationFilter);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      alert("Error updating record");
    },
  });
});

/*Edit Department */
$("#editDepartmentModal").on("show.bs.modal", function (e) {
  $.ajax({
    url: "src/php/getDepartmentByID.php",
    type: "POST",
    dataType: "json",
    data: {
      id: $(e.relatedTarget).attr("data-id"),
    },
    success: function (result) {
      var resultCode = result.status.code;
      $("#errorMessageDepartment").empty();
      if (resultCode == 200) {
        $("#editDepartmentID").val(result.data.department[0].id);
        $("#editDepartmentName").val(result.data.department[0].name);

        $("#editDepartmentLocation").html("");
        $.each(result.data.location, function () {
          $("#editDepartmentLocation").append(
            $("<option>", {
              value: this.id,
              text: this.name,
            })
          );
        });
        $("#editDepartmentLocation").val(result.data.department[0].locationID);
      } else {
        $("#editPersonnelModal .modal-title").replaceWith(
          "Error retrieving data"
        );
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#editPersonnelModal .modal-title").replaceWith(
        "Error retrieving data"
      );
      alert("Error retrieving data");
    },
  });
});

// Executes when the form button with type="submit" is clicked
$("#editDepartmentForm").on("submit", function (e) {
  e.preventDefault();

  const id = $("#editDepartmentID").val();
  const departmentName = $("#editDepartmentName").val();
  const location = $("#editDepartmentLocation").val();
  const departmentFormData = {
    id,
    departmentName,
    location,
  };

  let isDuplicate = false;
  /*Only one location per department is allowed */
  /*Meaning the department is uniqe */
  $("#departmentTable tr").each(function () {
    let currentRowId = $(this).find("td:first").attr("id");
    let firstColumnData = $(this).find("td:first").text();

    // Check if the name is the same and the ID is different
    if (
      firstColumnData.toLowerCase() === departmentName.toLowerCase() &&
      currentRowId !== id
    ) {
      $("#errorMessageDepartment").text("This department already exists.");
      isDuplicate = true;
      return false;
    }
  });

  if (!isDuplicate) {
    $.ajax({
      url: "src/php/editDepartment.php",
      type: "POST",
      dataType: "json",
      data: {
        departmentFormData,
      },
      success: function (result) {
        if (result.status.code == 200) {
          $("#editDepartmentModal").modal("hide");
          getDepartments(searchTerm);
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        alert("Error updating record");
      },
    });
  }
});

/*Edit Location */
$("#editLocationModal").on("show.bs.modal", function (e) {
  $.ajax({
    url: "src/php/getLocationByID.php",
    type: "POST",
    dataType: "json",
    data: {
      id: $(e.relatedTarget).attr("data-id"),
    },
    success: function (result) {
      $("#errorMessageLocation").empty();
      var resultCode = result.status.code;

      if (resultCode == 200) {
        $("#editLocationID").val(result.data[0].id);
        $("#editLocationName").val(result.data[0].name);
      } else {
        $("#editPersonnelModal .modal-title").replaceWith(
          "Error retrieving location data"
        );
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#editPersonnelModal .modal-title").replaceWith(
        "Error retrieving data"
      );
      alert("Error retrieving location data");
    },
  });
});

// Executes when the form button with type="submit" is clicked
$("#editLocationForm").on("submit", function (e) {
  e.preventDefault();
  const id = $("#editLocationID").val();
  const locationName = $("#editLocationName").val();
  const locationFormData = {
    id,
    locationName,
  };
  let isDuplicate = false;
  /*Locations uniqe */
  $("#locationTable tr").each(function () {
    let currentRowId = $(this).find("td:first").attr("id");
    let firstColumnData = $(this).find("td:first").text();

    // Check if the name is the same and the ID is different
    if (
      firstColumnData.toLowerCase() === locationName.toLowerCase() &&
      currentRowId !== id
    ) {
      $("#errorMessageLocation").text("This location already exists.");
      isDuplicate = true;
      return false;
    }
  });

  if (!isDuplicate) {
    $.ajax({
      url: "src/php/editLocation.php",
      type: "POST",
      dataType: "json",
      data: {
        locationFormData,
      },
      success: function (result) {
        if (result.status.code == 200) {
          $("#editLocationModal").modal("hide");
          getLocations(searchTerm);
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        alert("Error updating record");
      },
    });
  }
});

/*Delete Personnel */
$("#deletePersonnelModal").on("show.bs.modal", function (e) {
  $.ajax({
    url: "src/php/getPersonnelByID.php",
    type: "POST",
    dataType: "json",
    data: {
      id: $(e.relatedTarget).attr("data-id"), // Retrieves the data-id attribute from the calling button
    },
    success: function (result) {
      var resultCode = result.status.code;
      if (resultCode == 200) {
        // Update the hidden input with the employee id so that
        // it can be referenced when the form is submitted

        $("#deletePersonnelEmployeeID").val(result.data.personnel[0].id);

        $("#deleteName").text(
          `${result.data.personnel[0].firstName} ${result.data.personnel[0].lastName}`
        );
      } else {
        $("#deletePersonnelModal .modal-title").replaceWith(
          "Error retrieving data"
        );
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#deletePersonnelModal .modal-title").replaceWith(
        "Error retrieving data"
      );
      alert("Error retrieving data");
    },
  });
});

// Executes when the personnel deletion is confirmed
$("#confirmDeletePersonnel").on("click", function (e) {
  // e.preventDefault();
  const id = $("#deletePersonnelEmployeeID").val();

  $.ajax({
    url: "src/php/deletePersonnel.php",
    type: "POST",
    dataType: "json",
    data: {
      id,
    },
    success: function (result) {
      var resultCode = result.status.code;
      if (resultCode == 200) {
        $("#deletePersonnelModal").modal("hide");
        getPersonnel(searchTerm, departmentFilter, locationFilter);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      alert("Error deleting records");
    },
  });
});

/*Delete Department */
$(document).on("click", "#deleteDepartmentBtn", function (e) {
  const deleteID = $(this).attr("data-id");
  const deleteName = $(this).attr("data-name");
  $.ajax({
    url: "src/php/countPersonnelByDepartment.php",
    type: "POST",
    dataType: "json",
    data: {
      departmentID: deleteID,
    },
    success: function (result) {
      var resultCode = result.status.code;
      if (resultCode == 200) {
        if (result.data.length > 0) {
          $("#deleteDepartmentErrorModal").modal("show");
          $("#deleteDepartmentError").text(deleteName);
          $("#personnelAssigned").text(`${result.data.length}`);
        } else {
          $.ajax({
            url: "src/php/getDepartmentByID.php",
            type: "POST",
            dataType: "json",
            data: {
              id: deleteID,
            },
            success: function (result) {
              var resultCode = result.status.code;
              if (resultCode == 200) {
                $(`#deleteDepartmentModal`).modal("show");
                $("#deleteDepartmentID").val(result.data.department[0].id);
                $("#deleteDepartment").text(
                  `${result.data.department[0].name}`
                );
              }
            },
            error: function (jqXHR, textStatus, errorThrown) {
              $("#deleteDepartmentModal .modal-title").replaceWith(
                "Error retrieving data"
              );
              alert("Error retrieving data");
            },
          });
        }
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#deleteDepartmentModal .modal-title").replaceWith(
        "Error retrieving data"
      );
      alert("Error retrieving data");
    },
  });
});

// Executes when the department deletion is confirmed
$("#confirmDeleteDepartment").on("click", function (e) {
  const id = $("#deleteDepartmentID").val();

  $.ajax({
    url: "src/php/deleteDepartmentByID.php",
    type: "POST",
    dataType: "json",
    data: {
      id,
    },
    success: function (result) {
      var resultCode = result.status.code;
      if (resultCode == 200) {
        $("#deleteDepartmentModal").modal("hide");
        getDepartments(searchTerm);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      alert("Error deleting records");
    },
  });
});

/*Delete Location */
$(document).on("click", "#deleteLocationBtn", function (e) {
  const deleteLocationID = $(this).attr("data-id");
  const locationNameError = $(this).attr("data-name");
  $.ajax({
    url: "src/php/countDepartmentByLocation.php",
    type: "POST",
    dataType: "json",
    data: {
      locationID: deleteLocationID,
    },
    success: function (result) {
      var resultCode = result.status.code;
      if (resultCode == 200) {
        if (result.data.length > 0) {
          $("#deleteLocationErrorModal").modal("show");
          $("#deleteLocationError").text(locationNameError);
          $("#departmentAssign").text(result.data.length);
        } else {
          $.ajax({
            url: "src/php/getLocationByID.php",
            type: "POST",
            dataType: "json",
            data: {
              id: deleteLocationID,
            },
            success: function (result) {
              var resultCode = result.status.code;
              if (resultCode == 200) {
                $(`#deleteLocationModal`).modal("show");
                $("#deleteLocationID").val(result.data[0].id);
                $("#deleteLocation").text(`${result.data[0].name}`);
              }
            },
            error: function (jqXHR, textStatus, errorThrown) {
              $("#deleteDepartmentModal .modal-title").replaceWith(
                "Error retrieving data"
              );
              alert("Error retrieving data");
            },
          });
        }
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#deleteDepartmentModal .modal-title").replaceWith(
        "Error retrieving data"
      );
      alert("Error retrieving data");
    },
  });
});

// Executes when the location deletion is confirmed

$("#confirmDeleteLocation").on("click", function (e) {
  const id = $("#deleteLocationID").val();
  $.ajax({
    url: "src/php/deleteLocationByID.php",
    type: "POST",
    dataType: "json",
    data: {
      id,
    },
    success: function (result) {
      var resultCode = result.status.code;
      if (resultCode == 200) {
        $("#deleteLocationModal").modal("hide");
        getLocations(searchTerm);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      alert("Error deleting records");
    },
  });
});

/*Insert Location Form Submit */
$("#insertLocationForm").on("submit", function (e) {
  e.preventDefault();
  const locationName = $("#insertLocationName").val();
  let isDuplicate = false;
  /*Locations uniqe */
  $("#locationTable tr").each(function () {
    let firstColumnData = $(this).find("td:first").text();

    // Check if the name is the same
    if (firstColumnData.toLowerCase() === locationName.toLowerCase()) {
      $("#errorMessageLocationAdd").text("This location already exists.");
      isDuplicate = true;
      return false;
    }
  });

  if (!isDuplicate) {
    $.ajax({
      url: "src/php/insertLocation.php",
      type: "POST",
      dataType: "json",
      data: {
        locationName,
      },
      success: function (result) {
        var resultCode = result.status.code;
        if (resultCode == 200) {
          $("#insertLocationModal").modal("hide");
          getLocations(searchTerm);
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        alert("Unable to add location. Please try again.");
      },
    });
  }
});

/*Insert Department */
$("#insertDepartmentModal").on("show.bs.modal", function (e) {
  $.ajax({
    url: "src/php/getAllLocations.php",
    type: "POST",
    dataType: "json",
    data: {
      searchTerm: "",
    },
    success: function (result) {
      var resultCode = result.status.code;

      if (resultCode == 200) {
        $("#errorMessageDepartmentAdd").empty();
        $("#insertDepartmentName").val("");
        $("#insertDepartmentLocation").html("");
        $.each(result.data, function () {
          $("#insertDepartmentLocation").append(
            $("<option>", {
              value: this.id,
              text: this.name,
            })
          );
        });
      } else {
        $("#editPersonnelModal .modal-title").replaceWith(
          "Error retrieving data"
        );
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#editPersonnelModal .modal-title").replaceWith(
        "Error retrieving data"
      );
      alert("Error retrieving data");
    },
  });
});

// Executes when the form button with type="submit" is clicked
$("#insertDepartmentForm").on("submit", function (e) {
  e.preventDefault();
  const departmentName = $("#insertDepartmentName").val();
  const location = $("#insertDepartmentLocation").val();

  let isDuplicate = false;
  /*Only one location per department is allowed */
  /*Meaning the department is uniqe */
  $("#departmentTable tr").each(function () {
    let firstColumnData = $(this).find("td:first").text();

    // Check if the name is the same
    if (firstColumnData.toLowerCase() === departmentName.toLowerCase()) {
      $("#errorMessageDepartmentAdd").text("This department already exists.");
      isDuplicate = true;
      return false;
    }
  });

  if (!isDuplicate) {
    $.ajax({
      url: "src/php/insertDepartment.php",
      type: "POST",
      dataType: "json",
      data: {
        name: departmentName,
        locationID: location,
      },
      success: function (result) {
        if (result.status.code == 200) {
          $("#insertDepartmentModal").modal("hide");
          getDepartments(searchTerm);
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        alert("Unable to add location. Please try again.");
      },
    });
  }
});

/*Insert Personnel */
$("#insertPersonnelModal").on("show.bs.modal", function (e) {
  $.ajax({
    url: "src/php/getAllDepartments.php",
    type: "POST",
    dataType: "json",
    data: {
      searchTerm: "",
    },
    success: function (result) {
      var resultCode = result.status.code;

      if (resultCode == 200) {
        $("#insertPersonnelDepartment").html("");
        $.each(result.data, function () {
          $("#insertPersonnelDepartment").append(
            $("<option>", {
              value: this.id,
              text: this.name,
            })
          );
        });
      } else {
        $("#insertPersonnelModal .modal-title").replaceWith(
          "Error retrieving data"
        );
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#insertPersonnelModal .modal-title").replaceWith(
        "Error retrieving data"
      );
      alert("Error retrieving data");
    },
  });
});

// Executes when the form button with type="submit" is clicked
$("#insertPersonnelForm").on("submit", function (e) {
  e.preventDefault();
  const insertFirstName = $("#insertPersonnelFirstName").val();
  const insertLastName = $("#insertPersonnelLastName").val();
  const insertJobTitle = $("#insertPersonnelJobTitle").val();
  const insertEmail = $("#insertPersonnelEmailAddress").val();
  const insertDepartment = $("#insertPersonnelDepartment").val();

  $.ajax({
    url: "src/php/insertPersonnel.php",
    type: "POST",
    dataType: "json",
    data: {
      firstName: insertFirstName,
      lastName: insertLastName,
      jobTitle: insertJobTitle,
      email: insertEmail,
      departmentID: insertDepartment,
    },
    success: function (result) {
      if (result.status.code == 200) {
        $("#insertPersonnelModal").modal("hide");
        getPersonnel(searchTerm, departmentFilter, locationFilter);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      alert("Unable to add employee. Please try again.");
    },
  });
});

/*Filter Apply */
$("#filterPersonnelForm").on("submit", function (e) {
  departmentFilter = $("#filterPersonnelDepartment").val();
  locationFilter = $("#filterPersonnelLocation").val();

  getPersonnel(searchTerm, departmentFilter, locationFilter);

  e.preventDefault();
  $("#filterPersonnelModal").modal("hide");
});
