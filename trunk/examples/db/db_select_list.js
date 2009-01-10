/* 
 * Copyright (C) 2008 DeonWu@gmail.com
 *
 * This file is part of Js-Shell. Js-Shell is a set of library for running
 * javascript in Rhino.
 *
 * Js-Shell is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Js-Shell is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with Js-Shell.  If not, see <http://www.gnu.org/licenses/>.
 *
 * $ Name LastChangeRevision LastChangeDate LastChangeBy $
 * $Id$
 */

//init lang object.
var db = __import__('DB', null, {})

db.driver('org.sqlite.JDBC');

var conn = db.connect("jdbc:sqlite:test.db");

conn.debug = true;

print("conn:" + dir(conn));

var datas = conn.select_list("select * from bug_traker");

print("........");
each(datas, function(r) {
	print(r.bug_type + "," + r.track_id + "," + r.case_id + "," + r.active);
});

conn.close();
