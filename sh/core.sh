#!/bin/bash

apt-get update
# Install build tools
apt-get install -y git build-essential
apt-get install -y libjpeg-dev
# Install python package
apt-get install -y python python-dev python-setuptools python-pip
# Install postgresql package
apt-get install -y postgresql postgresql-contrib
apt-get install -y libpq-dev
