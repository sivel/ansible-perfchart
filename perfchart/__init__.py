#!/usr/bin/env python
# -*- coding: utf-8 -*-
# Copyright 2019 Matt Martz
#
#    This program is free software: you can redistribute it and/or modify
#    it under the terms of the GNU General Public License as published by
#    the Free Software Foundation, either version 3 of the License, or
#    (at your option) any later version.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU General Public License for more details.
#
#    You should have received a copy of the GNU General Public License
#    along with this program.  If not, see <https://www.gnu.org/licenses/>.

__version__ = '1.0.0'

import json
import os

from flask import Flask


kwargs = {}
app_path = os.path.dirname(__file__)
kwargs.update({
    'static_url_path': '',
    'static_folder': os.path.join(
        os.path.abspath(app_path),
        'client'
    )
})

app = Flask(__name__, **kwargs)


@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.route('/get')
@app.route('/get/<item>')
def get(item=None):
    if item:
        with open(os.path.join(app_path, '_baseline', item)) as f:
            item = f.read()
        return item

    items = os.listdir(os.path.join(app_path, '_baseline'))
    return json.dumps([i for i in items if not i[0] == '.'])
