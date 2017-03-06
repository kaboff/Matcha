#!/usr/bin/python
import os
import subprocess
import os.path
import sys

class color:
	red = '\033[91m'
	green = '\033[92m'
	blue = '\033[94m'
	cyan = '\033[96m'
	white = '\033[97m'
	yellow = '\033[93m'
	grey = '\033[90m'
	black = '\033[90m'
	warning = '\033[93m'
	fail = '\033[91m'
	end = '\033[0m'
	bold = '\033[1m'
	underline = '\033[4m'
	clear = '\033c'

install = False

if len(sys.argv) == 2 and sys.argv[1] == 'install':
	os.system('printf "'+color.clear+'"')
	os.system('echo "\n\n'+color.blue+'======= Meetal - Created by Ale-floc =======\n"'+color.end)

	if (not os.path.exists('/Users/'+os.environ["USER"]+'/n')):
		print color.warning + "NodeJs not found\n"+color.green+"Download ?" + color.cyan
		os.system("curl -sL https://git.io/n-install | bash >> yes")
		os.system('source ~/.zshrc') 
		color.end
		if (os.path.exists('/Users/'+os.environ["USER"]+'/n')):
			if os.path.exists('/Users/'+os.environ["USER"]+'/n/bin/n'):
				if os.path.exists('/Users/'+os.environ["USER"]+'/n/bin/node'):
					if os.path.exists('/Users/'+os.environ["USER"]+'/n/bin/npm'):
						os.system("n 6")
						print color.green + 'NodeJs download and install finish' + color.end
						install = True
					else:
						print color.fail + 'Problem detected with nodeJS, Please remove folder -> ' + '/Users/'+os.environ["USER"]+'/n' + color.end
				else:
					print color.fail + 'Problem detected with nodeJS, Please remove folder -> ' + '/Users/'+os.environ["USER"]+'/n' + color.end
			else:
				print color.fail + 'Problem detected with nodeJS, Please remove folder -> ' + '/Users/'+os.environ["USER"]+'/n' + color.end
		else:
			print color.fail + 'Problem detected with nodeJS, Please remove folder -> ' + '/Users/'+os.environ["USER"]+'/n' + color.end
	else:
		if (os.path.exists('/Users/'+os.environ["USER"]+'/n')):
			if os.path.exists('/Users/'+os.environ["USER"]+'/n/bin/n'):
				if os.path.exists('/Users/'+os.environ["USER"]+'/n/bin/node'):
					if os.path.exists('/Users/'+os.environ["USER"]+'/n/bin/npm'):
						print color.green + "NodeJS detected" + color.end
						install = True
					else:
						print color.fail + 'Problem detected with nodeJS, Please remove folder -> ' + '/Users/'+os.environ["USER"]+'/n' + color.end
				else:
					print color.fail + 'Problem detected with nodeJS, Please remove folder -> ' + '/Users/'+os.environ["USER"]+'/n' + color.end
			else:
				print color.fail + 'Problem detected with nodeJS, Please remove folder -> ' + '/Users/'+os.environ["USER"]+'/n' + color.end
		else:
			print color.fail + 'Problem detected with nodeJS, Please remove folder -> ' + '/Users/'+os.environ["USER"]+'/n' + color.end

	if (install):
		if not os.popen('curl -s localhost:8080').read() == "":
			if os.path.isfile(os.getcwd() + "/localhost.sql"):
				if os.path.isfile("/Users/"+os.environ["USER"]+"/http/bin/mysql"):
					os.system('~/http/bin/mysql -uroot -proot -e "DROP DATABASE matcha;" &> /dev/null')
					os.system('~/http/bin/mysql -uroot -proot < '+os.getcwd().replace(" ", "\ ")+'/localhost.sql &> /dev/null')
					print color.green + "Database install success." + color.end
				else:
					print color.warning + "Mysql not found, please launch Pamp before install" + color.end
			else:
				print color.fail + "Sql not found." + color.end
		else:
			print color.fail + "Launch Pamp before install\n" + color.end



elif len(sys.argv) == 2 and sys.argv[1] == 'clear:database':
	if os.path.isfile("/Users/"+os.environ["USER"]+"/http/bin/mysql"):
		os.system('/usr/local/mysql/bin/mysql -uroot -proot -e "USE matcha; TRUNCATE TABLE users; TRUNCATE TABLE actions;"  &> /dev/null')
		print color.green + "Database Clear" + color.end
	elif os.path.isfile("/Users/"+os.environ["USER"]+"/http/bin/mysql"):
		print color.fail + "Launch Pamp before clear\n" + color.end

elif len(sys.argv) == 2 and sys.argv[1] == 'clear:users':
	if os.path.isfile("/Users/"+os.environ["USER"]+"/http/bin/mysql"):
		os.system('/usr/local/mysql/bin/mysql -uroot -proot -e "USE matcha; TRUNCATE TABLE users;"  &> /dev/null')
		print color.green + "Database Clear" + color.end
	elif os.path.isfile("/Users/"+os.environ["USER"]+"/http/bin/mysql"):
		print color.fail + "Launch Pamp before clear\n" + color.end

elif len(sys.argv) == 2 and sys.argv[1] == 'clear:actions':
	if os.path.isfile("/Users/"+os.environ["USER"]+"/http/bin/mysql"):
		os.system('/usr/local/mysql/bin/mysql -uroot -proot -e "USE matcha; TRUNCATE TABLE actions;"  &> /dev/null')
		print color.green + "Database Clear" + color.end
	elif os.path.isfile("/Users/"+os.environ["USER"]+"/http/bin/mysql"):
		print color.fail + "Launch Pamp before clear\n" + color.end

elif len(sys.argv) == 2 and sys.argv[1] == 'start:server':
	if not os.popen('curl -s localhost:8080').read() == "":
		print color.green + "Server Start ->" + color.end
		os.system('node server.js')
	else:
		print color.fail + "Launch Pamp before start server" + color.end


else:
	print "Setup Usage : [install] [start:server] [clear:[database, users, actions]] [user:connect]"
