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
        '$filter',
        function($scope, $http, $filter) {
            $scope.baseline_files = [];
            $scope.selected_baselines = [];
            $scope.baselines = {};
            $scope.plays = [];
            $scope.selected_play = null;
            $scope.tasks = [];
            $scope.selected_task = null;

            $scope.series = [];
            $scope.labels = [];
            $scope.data = [];

            $scope.onClick = function (points, evt) {
                console.log(points, evt);
            };
            $scope.options = {
                legend: {
                    display: true
                },
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
                            position: 'left',
                            ticks: {
                                beginAtZero: true
                            },
                            afterBuildTicks: function(scale) {
                                var step = scale.ticks[0] - scale.ticks[1];
                                var max = 0;
                                for (i in $scope.data) {
                                    for (j in $scope.data[i]) {
                                        if ($scope.data[i][j] > max) {
                                            max = $scope.data[i][j];
                                        }
                                    }
                                }
                                if (scale.ticks[0] - max < step) {
                                    $scope.options.scales.yAxes[0].ticks.max = scale.ticks[0] + step;
                                }
                                return;
                            }
                        }
                    ]
                }
            }

            $scope.fetch = function() {
                $scope.baselines = {};
                $scope.selected_baselines.forEach(function(baseline) {
                    $http.get('get/' + baseline).then(
                        function(response) {
                            $scope.baselines[baseline] = response.data;
                            for (var i in response.data) {
                                var play = response.data[i];
                                if (!$scope.plays.includes(play.play.name)) {
                                    $scope.plays.push(play.play.name);
                                }
                                for (var j in play.tasks) {
                                    var task = play.tasks[j];
                                    if (!$scope.tasks.includes(task.task.name)) {
                                        $scope.tasks.push(task.task.name);
                                    }
                                }
                            }
                            $scope.graph();
                        },
                        function(response) {
                            // error
                            console.log(response);
                        }
                    );
                });
            }

            $scope.graph = function() {
                $scope.data = [];
                $scope.series = [];
                for (file in $scope.baselines) {
                    baseline = $scope.baselines[file];
                    $scope.labels = [];
                    $scope.series.push($filter('date')(file.split('.')[0], 'medium'));
                    baseline.forEach(function(item) {
                        if (item.play.name != $scope.selected_play) {
                            return;
                        }
                        item.tasks.forEach(function(task) {
                            if (task.task.name != $scope.selected_task) {
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
                }
            }

            $http.get('get').then(
                function(response) {
                    $scope.baseline_files = response.data;
                }
            )


        }
    ]);
})();
