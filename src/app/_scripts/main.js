/**
 * any scripts that operate outside of our angular code
 */
$(document).ready(function () {
    // click on tab link
    $(".nav-tabs a").click(function (e) {
        e.preventDefault();
        $(this).tab("show");
    });

    // uploading files
    $(document).on("click", ".upl-btn", function () {
        $(this).prev(".upl-input").trigger("click");
    });

    // modals table checkbox prevent self click for double result
    $(document).on("click", ".modal-dialog table tbody tr td:first-child input", function (event) {
        event.stopPropagation();
    });

    // Highcharts settings that we can"t adjust from ngHighcharts
    Highcharts.setOptions({
        global: {
            timezoneOffset: 0 //default
        },
        chart: {
            spacingLeft: 15,
            spacingRight: 0,
            backgroundColor: "rgba(0,0,0,0)"
        },
        plotOptions: {
            series: {
                marker: {
                    enabled: false
                }
            }
        },
        yAxis: {
            labels: {
                style: {
                    color: "#98978B"
                }
            }
        },
        legend: {
            enabled: false
        },
    });
});
