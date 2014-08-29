#bash

scp cardinal.stanford.edu:/afs/ir/group/langcog/cgi-bin/Cookie/cookie.csv .
perl -p -e 's/<br>/\n/g' cookie.csv > cookie_linebreak.csv