/*
Copyright 2019 Matt Martz

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

(function() {
    ngApp = angular.module('ngApp', ['chart.js']);

    ngApp.controller('mainController', [
        '$scope',
        '$http',
        '$sce',
        function($scope, $http, $sce) {
            $scope.baselines = [];
            $scope.selected_baselines = [];

            $scope.series = [];
            $scope.labels = [];
            $scope.data = [];

            $scope.onClick = function (points, evt) {
                console.log(points, evt);
            };
            $scope.options = {
                elements: {
                    line: {
                        fill: false
                    }
                },
                scales: {
                    yAxes: [
                        {
                            id: 'y-axis-1',
                            type: 'linear',
                            display: true,
                            position: 'left'
                        }
                    ]
                }
            }

            $scope.graph = function() {
                $scope.data = [];
                $scope.series = [];
                $scope.selected_baselines.forEach(function(baseline) {
                    $http.get('get/' + baseline).then(
                        function(response) {
                            $scope.labels = [];
                            $scope.series.push(baseline);
                            response.data.forEach(function(item) {
                                if (item.play.name != "SSH baseline") {
                                    return;
                                }
                                item.tasks.forEach(function(task) {
                                    if (task.task.name != 'Gather Facts') {
                                        return;
                                    }
                                    data = [];
                                    for (host in task.hosts) {
                                        $scope.labels.push(host);
                                        host_data = task.hosts[host];
                                        end = new Date(host_data.duration.end);
                                        start = new Date(host_data.duration.start);
                                        data.push(end.getSeconds() - start.getSeconds())
                                    }
                                    $scope.data.push(data);
                                });
                            });
                        },
                        function(response) {
                            console.log(response);
                        }
                    );
                });
            }

            $http.get('get').then(
                function(response) {
                    $scope.baselines = response.data;
                }
            )


        }
    ]);
})();
