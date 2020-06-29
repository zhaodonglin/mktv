#!/bin/bash

apt-get update
# Install build tools
apt-get install -y git build-essential
apt-get install -y libjpeg-dev
# Install python package
apt-get install -y python python-dev python-setuptools python-pip
# Install postgresql package
apt-get install -y postgresql-9.6 postgresql-contrib-9.6
apt-get install -y libpq-dev
