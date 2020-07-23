**Please follow the instructions below:**

1. Clone the project.
2. Setup the project according to the guide below.
3. Complete the tasks outlined [here](https://docs.google.com/document/d/12eaoESuavyArnrY9vPVg7e4-gPyHxPrP_yqWLXBsmWA).
4. Create your own private repository and upload your work on there. **Please do not** commit your work to this repository.
5. Share your repository with us.

---

# Development Environment and Local Server Set Up

1. [Setup Vagrant](#markdown-header-setup-vagrant)
2. [Setup the development environment inside the virtual machine](#markdown-header-virtual-machine-setup)

## Setup Vagrant

* Installation:
    * Download and install [Vagrant](https://www.vagrantup.com/downloads)
    * Download and install [VirtualBox](https://www.virtualbox.org/wiki/Downloads)
    * If you are on Windows, install [Cygwin](https://cygwin.com/install.html) for ssh capabilities.
* Build and enter the virtual machine:
    * From the root of the project, run: `vagrant up`
    * To ssh into the vm created, run: `vagrant ssh`
* Proceed to:
    * [Setup the development environment inside the virtual machine](#markdown-header-virtual-machine-setup)
    
## Setup the development environment

* Setup
    * Make sure you are in the project folder: `cd /vagrant/` (Vagrant maps this directory in the virtual machine to the project directory on your local machine and syncs it automatically)
    * Run `make`
    * Create a database user: `sudo -u postgres createuser <name> -s`
    * Go to settings/local.py and change the database user name to the above
    * Run `make database`
* Proceed to:
    * [Working in the virtual machine](#markdown-header-working-in-the-virtual-machine)

## Working in the virtual machine
* Whenever you start working, enter the virtual machine: `vagrant ssh`
* Make sure you are in the project folder: `cd /vagrant/`
* [Run the Server](#markdown-header-run-server)
* You can use any editor to modify the files in the project on your machine and the changes will be synced to the vagrant virtual machine.
* To leave the virtual machine, do `logout`
    * Now, from your command line, do `vagrant suspend` to suspend the vm, `vagrant halt` to shut it down and `vagrant destroy` to remove all traces of the vm from your system.

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