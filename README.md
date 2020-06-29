**Please follow the instructions below:**

1. Clone the project.
2. Setup the project according to the guide below.
3. Complete the tasks outlined [here](https://docs.google.com/document/d/12eaoESuavyArnrY9vPVg7e4-gPyHxPrP_yqWLXBsmWA).
4. Create your own private repository and upload your work on there. **Please do not** commit your work to this repository.
5. Share your repository with us.

---

# Development Environment and Local Server Set Up

* [Windows Installation and Setup Instructions](#markdown-header-windows-instructions)
* [Linux Installation and Setup Instructions](#markdown-header-linux-instructions)
* [Mac Installation and Setup Instructions](#markdown-header-mac-instructions)
* [Run the Server](#markdown-header-run-server)
* [Populate Database](#markdown-header-populate-database)

## Windows Instructions

If you experience a proplem take a look at the [Bug Solutions](#markdown-header-windows-bugs-solutions) at the bottom of this section

* Installation:
    * Download and install [PyCharm](https://www.jetbrains.com/pycharm/)
    * Install Python27 (Version 2.7.9+ comes with pip installed)
    * Install pip (you may have it already, check cmd, `pip -v`)
    * Install [Microsoft Visual C++ Compiler for Python 2.7](http://aka.ms/vcpython27)
    * Install postgreSQL version 9.6
        * [Download](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads)
        * pass=p, port=5432, user=postgres (might not need user)
    * To run "make" commands you will need to install [Cygwin](https://cygwin.com/install.html)
* Database set up
    * To start the database:
        * Open a new cmd prompt:
            * Run `"<path to pg_ctl.exe>" start -N "<service name (so you can identify it)>" -D "<db data location>"`
                * eg. `"C:\Program Files\PostgreSQL\9.6\bin\pg_ctl.exe" start -N "postgresql-x64-9.6" -D "C:\Program Files\PostgreSQL\9.6\data"`
                * You may need to change the command depending on where postgreSQL was installed for you
            * To stop the server hit ctrl+C
* Server Set up
    * Open the project in PyCharm
    * PyCharm now uses virtual environments, so let's create one for our project
        * *File > Settings > Project: [Web] > Project Interpretter > Gear (top-ish right) > Add Local*
            * Select New Environment
            * `Location:` Where your environment will be saved (remember this for later)
            * `Base Interpreter:` Select your python 2.7 installation
            * `inherit global site-packages` should be **un**checked
            * OK
            * Then make sure your `Project Interpreter` is the one you just created
            * Apply, OK.
    * You should run all the folling commands from your new virtual environment in pycharm:
        * *PyCharm > View > Tool Windows > Terminal*
    * run `setup.bat`
    * Run `bash` to enter the bash environment provided by Cygwin
    * We need to change bash's PATH to use our virtual environment's python and not cygwin's python
        * So we need a Cygwin-friendly path to the virtual environment:
            * My virtual environment's `Location:` was `C:/Users/<username>/venv/WebEnv/Scripts/`
            * So it becomes `/cygdrive/c/Users/<username>/venv/WebEnv/Scripts/`
        * run `export PATH=/cygdrive/c/Users/<username>/venv/Web2/Scripts/:$PATH`
    * Run `make db` (the database must be running already)
        * Error: If `make db` fails on "create" or "drop":
            * Open the project's "Makefile"
            * Find the line that matches `db: dropdb createdb migrate` (it should be about line 20)
            * Temporarily remove `dropdb createdb` from this line, save
            * Open the SQL shell:
                * You can use windows search to find "SQL Shell (psql)"
                * Or it you can access from `C:\Program Files\PostgreSQL\9.6\scripts\runpsql.bat` (Or whatever your path is)
                * In the newly opened terminal, run `CREATE DATABASE mktv;`
            * Undo the changes to the "Makefile"
            * Run `make db` again (in the pycharm terminal)
* Proceed to:
    * [Populate Database](#markdown-header-populate-database)
    * [Run the Server](#markdown-header-run-server)
    
###### Windows Bug Solutions

* If you can't run any of the make commands in setup.bat you probably need to install cygwin.
    * We can't just use the makefile on windows in the python venv because cygwin comes with it's own python and that is where it will try to run pip and stuff.  If it does that you won't have any of your packages installed in your virtual environment.
* If you receive `'module' object has no attribute 'inet_pton'` try the following from your virtual envrionment:
    * `pip install win-inet-pton`
    * In <venv path>\Lib\site-packages\geoip.py add `import win_inet_pton`
* When running the server you may experience errors about psycopg2 and PIL (or Pillow) to fix use **Microsoft Visual C++ Compiler for Python 2.7 cmd prompt**:
	* `pip uninstall PIL` (may not exist already)
	* `pip uninstall Pillow`
	* `pip install Pillow=4.2.1`

## Linux Instructions

* Installation:
    * Run sh/core.sh to install the build tools, python and postgresql packages
* Setup
    * Create a virtual environment: `virtualenv env`
    * Activate the virtual environment: `source env/bin/activate`
    * Create a database user: `sudo -u postgres createuser <name> -s`
    * Run `make`
    * Go to settings/local.py and change the database user name to the above
    * Run `make db`
* Proceed to:
    * [Populate Database](#markdown-header-populate-database)
    * [Run the Server](#markdown-header-run-server)
    
## Mac Instructions

* Installation:
    * `brew install python2`
    * `mkdir ~/.virtulenvs`
    * `sudo /usr/bin/easy_install virtualenv`
    * `sudo /usr/bin/easy_install virtualenvwrapper`
    * `echo "source /usr/local/bin/virtualenvwrapper.sh" >> ~/.bash_login $ source /usr/local/bin/virtualenvwrapper.sh`
    * `brew install libjpeg`
    * `python -m pip install --upgrade setuptools`
	* `brew install postgresql`
    * `mkvirtualenv env`
    * `sudo ln -sv /usr/local/opt/openssl/lib/libssl.a /usr/local/lib/`
    * `sudo ln -sv /usr/local/opt/openssl/lib/libcrypto.a /usr/local/lib/`

* Database setup:
    * `pg_ctl -D /usr/local/var/postgres start && brew services start postgresql`
    * `psql postgres`
    * `create database mktv;`
    * `create role mktv with login;`
    * `\q`
    * Create a database user: `sudo -u postgres createuser <name> -s`
    * Run `make`
    * Go to Settings/local.py and change the database user name to the above
    * Run `make db`
* Proceed to:
    * [Populate Database](#markdown-header-populate-database)
    * [Run the Server](#markdown-header-run-server)

## Populate Database

To populate database:

* `make loaddata`

## Run Server

* For http: `python manage.py runserver 0.0.0.0:8000`
    * visit http://localhost:8000 or https://localhost:8000/admin
* For https: `python manage.py runsslserver 0.0.0.0:8000`
    * visit http://localhost:8000 or https://localhost:8000/admin
* login to the admin portal using the admin username and password you specified during the initial setup

**Important**: If the site does not display properly, make sure you have compiled the css using the command below.

### SCSS

To compile scss files to css, run:
```
npm run scss-once
```
To start a service that automatically compiles scss files to css after file modifications run:
```
npm run scss
```
Note: If you get an error about a package/script not being found, try running `npm install` 