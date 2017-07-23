var indexURI = 'https://pypi.python.org/simple/';
var packageURI = 'https://pypi.python.org/pypi';
var indexCacheFile = Action.cachePath + '/index.json';


function searchName(name, limit) {
    var names = getPackageNames();
    var found = [];
    var regex = new RegExp('^' + name + '[a-z0-9_-]*', 'i');

    for (var i = 0; i < names.length; i++) {
        if (found.length >= limit) {
            break;
        }
        if (regex.test(names[i])) {
            var package = getPackage(names[i]);
            if (package) {
                found.push({
                    title: package['name'],
                    subtitle: package['summary'],
                    url: package['release_url'],
                    badge: package['version']
                });
            } else {
                found.push({
                    title: names[i]
                });
            }
        }
    }

    return found;
}


function getPackageNames() {
    var names = readIndexCacheFile();
    if (!names) {
        names = downloadPackageList();
    }

    return names;
}


function getPackage(name) {
    var package = readPackageCacheFile(name);
    if (!package) {
        package = downloadPackageJSON(name);
    }

    return package;
}


function downloadPackageList() {
    var result = HTTP.get(indexURI);

    if (result.data != undefined) {
        var regex = />([0-9a-z-_]+)<\/a>/igm;
        var names = [];

        while ((arr = regex.exec(result.data)) !== null) {
            names.push(arr[1]);
        }
    } else {
        names = false;
    }

    File.writeJSON(names, indexCacheFile);

    return names;
}


function downloadPackageJSON(name) {
    var URI = packageURI + '/' + name + '/json';
    var result = HTTP.getJSON(URI);

    if (result.data != undefined) {
        writePackageCacheFile(name, result.data['info']);
        return result.data['info'];
    } else {
        return false;
    }
}


function writePackageCacheFile(name, data) {
    File.writeJSON(data, Action.cachePath + '/package-' + name + '.json');
}


function readIndexCacheFile() {
    return readCache(indexCacheFile);
}


function readPackageCacheFile(name) {
    return readCache(Action.cachePath + '/package-' + name + '.json');
}


function readCache(file) {
    if (File.exists(file)) {
        return File.readJSON(file);
    } else {
        return false;
    }
}
