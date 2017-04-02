# movepng

Simple script files to facilitate PNG file grouping and PNG file copying according to Android density qualifier. Node 7 is required as `async` and `await` are used in the scripts.

## grouppng.js

This script can move the PNG files in a directory according to the common file name prefix.

### Usage
````
$ node --harmony grouppng.js /path/to/the/image/directory regex_for_defining_subfix
````

### Example

Original directory structure:
````
MyImages
├── ic-help-1x.png
├── ic-help-2x.png
├── ic-help-3x.png
├── ic-info-1x.png
├── ic-info-2x.png
├── ic-info-3x.png
├── ic-phone-1x.png
├── ic-phone-2x.png
└── ic-phone-3x.png
````
Command:
````
$ node --harmony grouppng.js MyImages \dx
````
Result directory structure:
````
MyImages
├── ic-help-
│   ├── ic-help-1x.png
│   ├── ic-help-2x.png
│   └── ic-help-3x.png
├── ic-info-
│   ├── ic-info-1x.png
│   ├── ic-info-2x.png
│   └── ic-info-3x.png
└── ic-phone-
    ├── ic-phone-1x.png
    ├── ic-phone-2x.png
    └── ic-phone-3x.png
````

## movepng.js

It moves the PNG files according to Android density qualifier directories.

Three strategies are supported and applied according to this order:

1. qualifier found in file name
2. last number found in file name
3. image height

### Usage
````
$ node --harmony movepng.js /path/to/the/image/directory file_name_you_want /path/to/the/android/project/res/directory
````

The last argument is optional.

### Example
Original directory structure:
````
ic-help
├── ic-help-hdpi.png
├── ic-help-mdpi.png
├── ic-help-xhdpi.png
├── ic-help-xxhdpi.png
└── ic-help-xxxhdpi.png
````
Command:
````
$ node --harmony movepng.js ic-help ic_help
````
Result directory structure:
````
ic-help
├── ic-help-hdpi.png
├── ic-help-mdpi.png
├── ic-help-xhdpi.png
├── ic-help-xxhdpi.png
├── ic-help-xxxhdpi.png
├── drawable-hdpi
│   └── ic_help.png
├── drawable-mdpi
│   └── ic_help.png
├── drawable-xhdpi
│   └── ic_help.png
├── drawable-xxhdpi
│   └── ic_help.png
└── drawable-xxxhdpi
    └── ic_help.png
````

You can now copy the drawable directories directly to your Android project without manually rename every PNG file. 
For macOS users, press Option and drag the directory in Finder so that the generated drawable directories can merge with 
your project's drawable directories.
