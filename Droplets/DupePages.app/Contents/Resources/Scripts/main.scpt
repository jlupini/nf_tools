FasdUAS 1.101.10   ��   ��    k             i         I     ������
�� .aevtoappnull  �   � ****��  ��    k     � 	 	  
  
 l     ��  ��      prompt for files     �   "   p r o m p t   f o r   f i l e s      r         I    	���� 
�� .sysostdfalis    ��� null��    ��  
�� 
prmp  m       �   N P l e a s e   s e l e c t   t h e   P D F   p a g e s   t o   p r o c e s s :  �� ��
�� 
mlsl  m    ��
�� boovtrue��    o      ���� 0 thefiles theFiles      l   ��  ��      duplicate files     �       d u p l i c a t e   f i l e s      r       !   J    ����   ! o      ���� (0 theannotationfiles theAnnotationFiles   " # " l   ��������  ��  ��   #  $ % $ X    � &�� ' & k   ! � ( (  ) * ) l  ! !��������  ��  ��   *  + , + O   ! + - . - r   % * / 0 / n   % ( 1 2 1 1   & (��
�� 
pnam 2 o   % &���� 0 thefile theFile 0 o      ���� 0 thefilename theFileName . m   ! " 3 3�                                                                                  MACS  alis    @  Macintosh HD                   BD ����
Finder.app                                                     ����            ����  
 cu             CoreServices  )/:System:Library:CoreServices:Finder.app/    
 F i n d e r . a p p    M a c i n t o s h   H D  &System/Library/CoreServices/Finder.app  / ��   ,  4 5 4 l  , ,��������  ��  ��   5  6 7 6 r   , < 8 9 8 b   , 8 : ; : I   , 4�� <���� 0 trimtext trimText <  = > = o   - .���� 0 thefilename theFileName >  ? @ ? m   . / A A � B B  . p d f @  C�� C m   / 0 D D � E E  e n d��  ��   ; m   4 7 F F � G G  _ a n n o t . p d f 9 o      ���� *0 destinationfilename destinationFileName 7  H I H l  = =��������  ��  ��   I  J K J O   = s L M L Q   A r N O P N k   D c Q Q  R S R r   D M T U T I  D I�� V��
�� .coreclon****      � **** V o   D E���� 0 thefile theFile��   U o      ���� 0 thedupe theDupe S  W X W r   N Y Y Z Y c   N U [ \ [ o   N Q���� 0 thedupe theDupe \ m   Q T��
�� 
alis Z o      ���� 0 thedupealias theDupeAlias X  ]�� ] r   Z c ^ _ ^ o   Z ]���� *0 destinationfilename destinationFileName _ n       ` a ` 1   ` b��
�� 
pnam a o   ] `���� 0 thedupe theDupe��   O R      ������
�� .ascrerr ****      � ****��  ��   P I  k r�� b��
�� .sysodlogaskr        TEXT b m   k n c c � d d \ O o p s ,   a   p r o b l e m   o c c u r r e d   d u p l i c a t i n g   t h e   f i l e .��   M m   = > e e�                                                                                  MACS  alis    @  Macintosh HD                   BD ����
Finder.app                                                     ����            ����  
 cu             CoreServices  )/:System:Library:CoreServices:Finder.app/    
 F i n d e r . a p p    M a c i n t o s h   H D  &System/Library/CoreServices/Finder.app  / ��   K  f g f I  t y�� h��
�� .ascrcmnt****      � **** h o   t u���� 0 thefile theFile��   g  i j i l  z z��������  ��  ��   j  k l k I  z ��� m��
�� .ascrcmnt****      � **** m o   z }���� 0 thedupealias theDupeAlias��   l  n o n l  � ���������  ��  ��   o  p q p r   � � r s r o   � ����� 0 thedupealias theDupeAlias s n       t u t  ;   � � u o   � ����� (0 theannotationfiles theAnnotationFiles q  v w v l  � ���������  ��  ��   w  x�� x l  � ���������  ��  ��  ��  �� 0 thefile theFile ' o    ���� 0 thefiles theFiles %  y z y l  � ���������  ��  ��   z  { | { l  � ��� } ~��   } 
  try    ~ �      t r y |  � � � l  � ��� � ���   � ' !	process_item(theAnnotationFiles)    � � � � B 	 p r o c e s s _ i t e m ( t h e A n n o t a t i o n F i l e s ) �  ��� � l  � ��� � ���   �   end try    � � � �    e n d   t r y��     � � � l     ��������  ��  ��   �  � � � l     �� � ���   � %  edit droplet if double clicked    � � � � >   e d i t   d r o p l e t   i f   d o u b l e   c l i c k e d �  � � � l      �� � ���   � � � on run
	try
		tell application "Finder"
			set myPath to path to me
		end tell
		with timeout of 10 seconds
			tell application "Adobe Acrobat"
				activate
				delay 1
				�event PRFLEDIT� myPath
			end tell
		end timeout
	end try
end run     � � � ��   o n   r u n 
 	 t r y 
 	 	 t e l l   a p p l i c a t i o n   " F i n d e r " 
 	 	 	 s e t   m y P a t h   t o   p a t h   t o   m e 
 	 	 e n d   t e l l 
 	 	 w i t h   t i m e o u t   o f   1 0   s e c o n d s 
 	 	 	 t e l l   a p p l i c a t i o n   " A d o b e   A c r o b a t " 
 	 	 	 	 a c t i v a t e 
 	 	 	 	 d e l a y   1 
 	 	 	 	 � e v e n t   P R F L E D I T �   m y P a t h 
 	 	 	 e n d   t e l l 
 	 	 e n d   t i m e o u t 
 	 e n d   t r y 
 e n d   r u n   �  � � � l     ��������  ��  ��   �  � � � l     �� � ���   � . ( processes files dropped onto the applet    � � � � P   p r o c e s s e s   f i l e s   d r o p p e d   o n t o   t h e   a p p l e t �  � � � i     � � � I     �� ���
�� .aevtodocnull  �    alis � o      ���� 0 these_items  ��   � k     q � �  � � � r      � � � o     ���� 0 these_items   � o      ���� 0 thefiles theFiles �  � � � r     � � � J    ����   � o      ���� (0 theannotationfiles theAnnotationFiles �  � � � l  	 	��������  ��  ��   �  ��� � X   	 q ��� � � k    l � �  � � � l   ��������  ��  ��   �  � � � O    # � � � r    " � � � n      � � � 1     ��
�� 
pnam � o    ���� 0 thefile theFile � o      ���� 0 thefilename theFileName � m     � ��                                                                                  MACS  alis    @  Macintosh HD                   BD ����
Finder.app                                                     ����            ����  
 cu             CoreServices  )/:System:Library:CoreServices:Finder.app/    
 F i n d e r . a p p    M a c i n t o s h   H D  &System/Library/CoreServices/Finder.app  / ��   �  � � � l  $ $��������  ��  ��   �  � � � r   $ 0 � � � b   $ . � � � I   $ ,�� ����� 0 trimtext trimText �  � � � o   % &���� 0 thefilename theFileName �  � � � m   & ' � � � � �  . p d f �  ��� � m   ' ( � � � � �  e n d��  ��   � m   , - � � � � �  _ a n n o t . p d f � o      ���� *0 destinationfilename destinationFileName �  � � � l  1 1��������  ��  ��   �  � � � O   1 Y � � � Q   5 X � � � � k   8 K � �  � � � r   8 ? � � � I  8 =�� ���
�� .coreclon****      � **** � o   8 9���� 0 thefile theFile��   � o      ���� 0 thedupe theDupe �  � � � r   @ E � � � c   @ C � � � o   @ A���� 0 thedupe theDupe � m   A B��
�� 
alis � o      ���� 0 thedupealias theDupeAlias �  ��� � r   F K � � � o   F G���� *0 destinationfilename destinationFileName � n       � � � 1   H J�
� 
pnam � o   G H�~�~ 0 thedupe theDupe��   � R      �}�|�{
�} .ascrerr ****      � ****�|  �{   � I  S X�z ��y
�z .sysodlogaskr        TEXT � m   S T � � � � � \ O o p s ,   a   p r o b l e m   o c c u r r e d   d u p l i c a t i n g   t h e   f i l e .�y   � m   1 2 � ��                                                                                  MACS  alis    @  Macintosh HD                   BD ����
Finder.app                                                     ����            ����  
 cu             CoreServices  )/:System:Library:CoreServices:Finder.app/    
 F i n d e r . a p p    M a c i n t o s h   H D  &System/Library/CoreServices/Finder.app  / ��   �  � � � I  Z _�x ��w
�x .ascrcmnt****      � **** � o   Z [�v�v 0 thefile theFile�w   �  � � � l  ` `�u�t�s�u  �t  �s   �  � � � I  ` e�r ��q
�r .ascrcmnt****      � **** � o   ` a�p�p 0 thedupealias theDupeAlias�q   �  � � � l  f f�o�n�m�o  �n  �m   �  � � � r   f j � � � o   f g�l�l 0 thedupealias theDupeAlias � n       � � �  ;   h i � o   g h�k�k (0 theannotationfiles theAnnotationFiles �  � � � l  k k�j�i�h�j  �i  �h   �  ��g � l  k k�f�e�d�f  �e  �d  �g  �� 0 thefile theFile � o    �c�c 0 thefiles theFiles��   �    l     �b�a�`�b  �a  �`    l     �_�_   ' ! this sub-routine processes files    � B   t h i s   s u b - r o u t i n e   p r o c e s s e s   f i l e s  i    	
	 I      �^�]�^ 0 process_item   �\ o      �[�[ 0 	this_item  �\  �]  
 Q     4�Z k    +  O     r     I   �Y�X
�Y .earsffdralis        afdr  f    �X   o      �W�W 0 mypath myPath m    �                                                                                  MACS  alis    @  Macintosh HD                   BD ����
Finder.app                                                     ����            ����  
 cu             CoreServices  )/:System:Library:CoreServices:Finder.app/    
 F i n d e r . a p p    M a c i n t o s h   H D  &System/Library/CoreServices/Finder.app  / ��   �V t    + O    * k    )  I   �U�T�S
�U .miscactvnull��� ��� null�T  �S    !  I   !�R"�Q
�R .sysodelanull��� ��� nmbr" m    �P�P �Q  ! #�O# I  " )�N$%
�N .PRFLPRFL****      � ****$ o   " #�M�M 0 	this_item  % �L&�K
�L 
PATH& o   $ %�J�J 0 mypath myPath�K  �O   m    ''�                                                                                  CARO  alis    d  Macintosh HD                   BD ����Adobe Acrobat.app                                              ����            ����  
 cu             Adobe Acrobat DC  2/:Applications:Adobe Acrobat DC:Adobe Acrobat.app/  $  A d o b e   A c r o b a t . a p p    M a c i n t o s h   H D  /Applications/Adobe Acrobat DC/Adobe Acrobat.app   / ��   m    �I�I �V   R      �H�G�F
�H .ascrerr ****      � ****�G  �F  �Z   ()( l     �E�D�C�E  �D  �C  ) *+* l     �B,-�B  ,   Text Trim function   - �.. &   T e x t   T r i m   f u n c t i o n+ /�A/ i    010 I      �@2�?�@ 0 trimtext trimText2 343 o      �>�> 0 thetext theText4 565 o      �=�= *0 thecharacterstotrim theCharactersToTrim6 7�<7 o      �;�; $0 thetrimdirection theTrimDirection�<  �?  1 k     {88 9:9 r     ;<; n     =>= 1    �:
�: 
leng> o     �9�9 *0 thecharacterstotrim theCharactersToTrim< o      �8�8 0 thetrimlength theTrimLength: ?@? Z    >AB�7�6A E   CDC J    
EE FGF m    HH �II  b e g i n n i n gG J�5J m    KK �LL  b o t h�5  D o   
 �4�4 $0 thetrimdirection theTrimDirectionB V    :MNM Q    5OPQO r    +RSR c    )TUT n    'VWV 7   '�3XY
�3 
cha X l   #Z�2�1Z [    #[\[ o     !�0�0 0 thetrimlength theTrimLength\ m   ! "�/�/ �2  �1  Y m   $ &�.�.��W o    �-�- 0 thetext theTextU m   ' (�,
�, 
TEXTS o      �+�+ 0 thetext theTextP R      �*�)�(
�* .ascrerr ****      � ****�)  �(  Q k   3 5]] ^_^ l  3 3�'`a�'  ` 0 * text contains nothing but trim characters   a �bb T   t e x t   c o n t a i n s   n o t h i n g   b u t   t r i m   c h a r a c t e r s_ c�&c L   3 5dd m   3 4ee �ff  �&  N C   ghg o    �%�% 0 thetext theTexth o    �$�$ *0 thecharacterstotrim theCharactersToTrim�7  �6  @ iji Z   ? xkl�#�"k E  ? Emnm J   ? Coo pqp m   ? @rr �ss  e n dq t�!t m   @ Auu �vv  b o t h�!  n o   C D� �  $0 thetrimdirection theTrimDirectionl V   H twxw Q   P oyz{y r   S e|}| c   S c~~ n   S a��� 7  T a���
� 
cha � m   X Z�� � d   [ `�� l  \ _���� [   \ _��� o   \ ]�� 0 thetrimlength theTrimLength� m   ] ^�� �  �  � o   S T�� 0 thetext theText m   a b�
� 
TEXT} o      �� 0 thetext theTextz R      ���
� .ascrerr ****      � ****�  �  { k   m o�� ��� l  m m����  � 0 * text contains nothing but trim characters   � ��� T   t e x t   c o n t a i n s   n o t h i n g   b u t   t r i m   c h a r a c t e r s� ��� L   m o�� m   m n�� ���  �  x D   L O��� o   L M�� 0 thetext theText� o   M N�� *0 thecharacterstotrim theCharactersToTrim�#  �"  j ��� L   y {�� o   y z�� 0 thetext theText�  �A       ���������������
�	���  � ������� ������������������
� .aevtoappnull  �   � ****
� .aevtodocnull  �    alis� 0 process_item  � 0 trimtext trimText� 0 thefiles theFiles� (0 theannotationfiles theAnnotationFiles�  0 thefilename theFileName�� *0 destinationfilename destinationFileName�� 0 thedupe theDupe�� 0 thedupealias theDupeAlias��  ��  ��  ��  ��  ��  � �� ��������
�� .aevtoappnull  �   � ****��  ��  � ���� 0 thefile theFile� �� ���������������� 3���� A D�� F�������������� c����
�� 
prmp
�� 
mlsl�� 
�� .sysostdfalis    ��� null�� 0 thefiles theFiles�� (0 theannotationfiles theAnnotationFiles
�� 
kocl
�� 
cobj
�� .corecnte****       ****
�� 
pnam�� 0 thefilename theFileName�� 0 trimtext trimText�� *0 destinationfilename destinationFileName
�� .coreclon****      � ****�� 0 thedupe theDupe
�� 
alis�� 0 thedupealias theDupeAlias��  ��  
�� .sysodlogaskr        TEXT
�� .ascrcmnt****      � ****�� �*���e� E�OjvE�O }�[��l 	kh  � ��,E�UO*���m+ a %E` O� 3 $�j E` O_ a &E` O_ _ �,FW X  a j UO�j O_ j O_ �6FOP[OY��OP� �� ���������
�� .aevtodocnull  �    alis�� 0 these_items  ��  � ������������������ 0 these_items  �� 0 thefiles theFiles�� (0 theannotationfiles theAnnotationFiles�� 0 thefile theFile�� 0 thefilename theFileName�� *0 destinationfilename destinationFileName�� 0 thedupe theDupe�� 0 thedupealias theDupeAlias� ������ ��� � ��� ��������� �����
�� 
kocl
�� 
cobj
�� .corecnte****       ****
�� 
pnam�� 0 trimtext trimText
�� .coreclon****      � ****
�� 
alis��  ��  
�� .sysodlogaskr        TEXT
�� .ascrcmnt****      � ****�� r�E�OjvE�O g�[��l kh � ��,E�UO*���m+ �%E�O� % �j 	E�O��&E�O���,FW X  �j UO�j O�j O��6FOP[OY��� ��
���������� 0 process_item  �� ����� �  ���� 0 	this_item  ��  � ������ 0 	this_item  �� 0 mypath myPath� 	��'������������
�� .earsffdralis        afdr
�� .miscactvnull��� ��� null
�� .sysodelanull��� ��� nmbr
�� 
PATH
�� .PRFLPRFL****      � ****��  ��  �� 5 -� 	)j E�UOkn� *j Okj O��l UoW X  h� ��1���������� 0 trimtext trimText�� ����� �  �������� 0 thetext theText�� *0 thecharacterstotrim theCharactersToTrim�� $0 thetrimdirection theTrimDirection��  � ���������� 0 thetext theText�� *0 thecharacterstotrim theCharactersToTrim�� $0 thetrimdirection theTrimDirection�� 0 thetrimlength theTrimLength� ��HK��������eru�
�� 
leng
�� 
cha 
�� 
TEXT��  ��  �� |��,E�O��lv� 0 *h�� �[�\[Z�k\Zi2�&E�W 	X  �[OY��Y hO��lv� 1 +h�� �[�\[Zk\Z�k'2�&E�W 	X  �[OY��Y hO�� ����� �  ���alis    �   Macintosh HD                   BD ����19_pg08.pdf                                                    ����            ����  J cu            �/:Users:lucas:Avocado Video Dropbox:NF Active Prep:Volume 42:42-10 The Effects of Avocados on Inflammation:Assets:PDF Pages:19_pg08.pdf     1 9 _ p g 0 8 . p d f    M a c i n t o s h   H D  �Users/lucas/Avocado Video Dropbox/NF Active Prep/Volume 42/42-10 The Effects of Avocados on Inflammation/Assets/PDF Pages/19_pg08.pdf   /    ��  � ����� �  ��������������������������������alis       Macintosh HD                   BD ����19_pg08 copy.pdf                                               ����            ����  
 cu             	PDF Pages   �/:Users:lucas:Avocado Video Dropbox:NF Active Prep:Volume 42:42-10 The Effects of Avocados on Inflammation:Assets:PDF Pages:19_pg08 copy.pdf  "  1 9 _ p g 0 8   c o p y . p d f    M a c i n t o s h   H D  �Users/lucas/Avocado Video Dropbox/NF Active Prep/Volume 42/42-10 The Effects of Avocados on Inflammation/Assets/PDF Pages/19_pg08 copy.pdf  /    ��  ��  ��  ��  ��  ��  ��  ��  ��  ��  ��  ��  ��  ��  ��  ��  � ���  1 9 _ p g 0 8 . p d f� ��� " 1 9 _ p g 0 8 _ a n n o t . p d f� �� ����� ����� ����� ����� ����� ����� ����� ����� �����  3��
�� 
sdsk
�� 
cfol� ��� 
 U s e r s
�� 
cfol� ��� 
 l u c a s
�� 
cfol� ��� * A v o c a d o   V i d e o   D r o p b o x
�� 
cfol� ���  N F   A c t i v e   P r e p
�� 
cfol� ���  V o l u m e   4 2
�� 
cfol� ��� Z 4 2 - 1 0   T h e   E f f e c t s   o f   A v o c a d o s   o n   I n f l a m m a t i o n
�� 
cfol� ���  A s s e t s
�� 
cfol� ���  P D F   P a g e s
�� 
docf� ���   1 9 _ p g 0 8   c o p y . p d f�  �  �
  �	  �  �   ascr  ��ޭ