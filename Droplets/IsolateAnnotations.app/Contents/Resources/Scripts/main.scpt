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
pnam 2 o   % &���� 0 thefile theFile 0 o      ���� 0 thefilename theFileName . m   ! " 3 3�                                                                                  MACS  alis    t  Macintosh HD               �/4�H+     (
Finder.app                                                      �j�T�        ����  	                CoreServices    �/�Y      ��;       (   '   &  6Macintosh HD:System: Library: CoreServices: Finder.app   
 F i n d e r . a p p    M a c i n t o s h   H D  &System/Library/CoreServices/Finder.app  / ��   ,  4 5 4 l  , ,��������  ��  ��   5  6 7 6 r   , < 8 9 8 b   , 8 : ; : I   , 4�� <���� 0 trimtext trimText <  = > = o   - .���� 0 thefilename theFileName >  ? @ ? m   . / A A � B B  . p d f @  C�� C m   / 0 D D � E E  e n d��  ��   ; m   4 7 F F � G G  _ a n n o t . p d f 9 o      ���� *0 destinationfilename destinationFileName 7  H I H l  = =��������  ��  ��   I  J K J O   = s L M L Q   A r N O P N k   D c Q Q  R S R r   D M T U T I  D I�� V��
�� .coreclon****      � **** V o   D E���� 0 thefile theFile��   U o      ���� 0 thedupe theDupe S  W X W r   N Y Y Z Y c   N U [ \ [ o   N Q���� 0 thedupe theDupe \ m   Q T��
�� 
alis Z o      ���� 0 thedupealias theDupeAlias X  ]�� ] r   Z c ^ _ ^ o   Z ]���� *0 destinationfilename destinationFileName _ n       ` a ` 1   ` b��
�� 
pnam a o   ] `���� 0 thedupe theDupe��   O R      ������
�� .ascrerr ****      � ****��  ��   P I  k r�� b��
�� .sysodlogaskr        TEXT b m   k n c c � d d \ O o p s ,   a   p r o b l e m   o c c u r r e d   d u p l i c a t i n g   t h e   f i l e .��   M m   = > e e�                                                                                  MACS  alis    t  Macintosh HD               �/4�H+     (
Finder.app                                                      �j�T�        ����  	                CoreServices    �/�Y      ��;       (   '   &  6Macintosh HD:System: Library: CoreServices: Finder.app   
 F i n d e r . a p p    M a c i n t o s h   H D  &System/Library/CoreServices/Finder.app  / ��   K  f g f I  t y�� h��
�� .ascrcmnt****      � **** h o   t u���� 0 thefile theFile��   g  i j i l  z z��������  ��  ��   j  k l k I  z ��� m��
�� .ascrcmnt****      � **** m o   z }���� 0 thedupealias theDupeAlias��   l  n o n l  � ���������  ��  ��   o  p q p r   � � r s r o   � ����� 0 thedupealias theDupeAlias s n       t u t  ;   � � u o   � ����� (0 theannotationfiles theAnnotationFiles q  v w v l  � ���������  ��  ��   w  x�� x l  � ���������  ��  ��  ��  �� 0 thefile theFile ' o    ���� 0 thefiles theFiles %  y z y l  � ���������  ��  ��   z  {�� { Q   � � | }�� | I   � ��� ~���� 0 process_item   ~  ��  o   � ����� (0 theannotationfiles theAnnotationFiles��  ��   } R      ������
�� .ascrerr ****      � ****��  ��  ��  ��     � � � l     ��������  ��  ��   �  � � � l     �� � ���   � %  edit droplet if double clicked    � � � � >   e d i t   d r o p l e t   i f   d o u b l e   c l i c k e d �  � � � l      �� � ���   � � � on run	try		tell application "Finder"			set myPath to path to me		end tell		with timeout of 10 seconds			tell application "Adobe Acrobat"				activate				delay 1				�event PRFLEDIT� myPath			end tell		end timeout	end tryend run     � � � ��   o n   r u n  	 t r y  	 	 t e l l   a p p l i c a t i o n   " F i n d e r "  	 	 	 s e t   m y P a t h   t o   p a t h   t o   m e  	 	 e n d   t e l l  	 	 w i t h   t i m e o u t   o f   1 0   s e c o n d s  	 	 	 t e l l   a p p l i c a t i o n   " A d o b e   A c r o b a t "  	 	 	 	 a c t i v a t e  	 	 	 	 d e l a y   1  	 	 	 	 � e v e n t   P R F L E D I T �   m y P a t h  	 	 	 e n d   t e l l  	 	 e n d   t i m e o u t  	 e n d   t r y  e n d   r u n   �  � � � l     ��������  ��  ��   �  � � � l     �� � ���   � . ( processes files dropped onto the applet    � � � � P   p r o c e s s e s   f i l e s   d r o p p e d   o n t o   t h e   a p p l e t �  � � � i     � � � I     �� ���
�� .aevtodocnull  �    alis � o      ���� 0 these_items  ��   � Q      � ��� � I    	�� ����� 0 process_item   �  ��� � o    ���� 0 these_items  ��  ��   � R      ������
�� .ascrerr ****      � ****��  ��  ��   �  � � � l     ��������  ��  ��   �  � � � l     �� � ���   � ' ! this sub-routine processes files    � � � � B   t h i s   s u b - r o u t i n e   p r o c e s s e s   f i l e s �  � � � i     � � � I      �� ����� 0 process_item   �  ��� � o      ���� 0 	this_item  ��  ��   � Q     4 � ��� � k    + � �  � � � O     � � � r     � � � I   �� ���
�� .earsffdralis        afdr �  f    ��   � o      ���� 0 mypath myPath � m     � ��                                                                                  MACS  alis    t  Macintosh HD               �/4�H+     (
Finder.app                                                      �j�T�        ����  	                CoreServices    �/�Y      ��;       (   '   &  6Macintosh HD:System: Library: CoreServices: Finder.app   
 F i n d e r . a p p    M a c i n t o s h   H D  &System/Library/CoreServices/Finder.app  / ��   �  ��� � t    + � � � O    * � � � k    ) � �  � � � I   ������
�� .miscactvnull��� ��� null��  ��   �  � � � I   !�� ���
�� .sysodelanull��� ��� nmbr � m    ���� ��   �  ��� � I  " )�� � �
�� .PRFLPRFL****      � **** � o   " #���� 0 	this_item   � � ��~
� 
PATH � o   $ %�}�} 0 mypath myPath�~  ��   � m     � ��                                                                                  CARO  alis    �  Macintosh HD               �/4�H+   �JAdobe Acrobat.app                                               ���)2        ����  	                Adobe Acrobat DC    �/�Y      ���     �J   G  >Macintosh HD:Applications: Adobe Acrobat DC: Adobe Acrobat.app  $  A d o b e   A c r o b a t . a p p    M a c i n t o s h   H D  /Applications/Adobe Acrobat DC/Adobe Acrobat.app   / ��   � m    �|�| ��   � R      �{�z�y
�{ .ascrerr ****      � ****�z  �y  ��   �  � � � l     �x�w�v�x  �w  �v   �  � � � l     �u � ��u   �   Text Trim function    � � � � &   T e x t   T r i m   f u n c t i o n �  ��t � i     � � � I      �s ��r�s 0 trimtext trimText �  � � � o      �q�q 0 thetext theText �  � � � o      �p�p *0 thecharacterstotrim theCharactersToTrim �  ��o � o      �n�n $0 thetrimdirection theTrimDirection�o  �r   � k     { � �  � � � r      � � � n      � � � 1    �m
�m 
leng � o     �l�l *0 thecharacterstotrim theCharactersToTrim � o      �k�k 0 thetrimlength theTrimLength �  � � � Z    > � ��j�i � E    � � � J    
 � �  � � � m     � � � � �  b e g i n n i n g �  ��h � m     � � � � �  b o t h�h   � o   
 �g�g $0 thetrimdirection theTrimDirection � V    : � � � Q    5 � � � � r    + � � � c    ) � � � n    ' � � � 7   '�f � �
�f 
cha  � l   # ��e�d � [    # � � � o     !�c�c 0 thetrimlength theTrimLength � m   ! "�b�b �e  �d   � m   $ &�a�a�� � o    �`�` 0 thetext theText � m   ' (�_
�_ 
TEXT � o      �^�^ 0 thetext theText � R      �]�\�[
�] .ascrerr ****      � ****�\  �[   � k   3 5 � �  � � � l  3 3�Z � ��Z   � 0 * text contains nothing but trim characters    � � � � T   t e x t   c o n t a i n s   n o t h i n g   b u t   t r i m   c h a r a c t e r s �  ��Y � L   3 5   m   3 4 �  �Y   � C    o    �X�X 0 thetext theText o    �W�W *0 thecharacterstotrim theCharactersToTrim�j  �i   �  Z   ? x�V�U E  ? E	
	 J   ? C  m   ? @ �  e n d �T m   @ A �  b o t h�T  
 o   C D�S�S $0 thetrimdirection theTrimDirection V   H t Q   P o r   S e c   S c n   S a 7  T a�R
�R 
cha  m   X Z�Q�Q  d   [ `   l  \ _!�P�O! [   \ _"#" o   \ ]�N�N 0 thetrimlength theTrimLength# m   ] ^�M�M �P  �O   o   S T�L�L 0 thetext theText m   a b�K
�K 
TEXT o      �J�J 0 thetext theText R      �I�H�G
�I .ascrerr ****      � ****�H  �G   k   m o$$ %&% l  m m�F'(�F  ' 0 * text contains nothing but trim characters   ( �)) T   t e x t   c o n t a i n s   n o t h i n g   b u t   t r i m   c h a r a c t e r s& *�E* L   m o++ m   m n,, �--  �E   D   L O./. o   L M�D�D 0 thetext theText/ o   M N�C�C *0 thecharacterstotrim theCharactersToTrim�V  �U   0�B0 L   y {11 o   y z�A�A 0 thetext theText�B  �t       �@23456789:;<�?�>�=�<�;�:�@  2 �9�8�7�6�5�4�3�2�1�0�/�.�-�,�+�*
�9 .aevtoappnull  �   � ****
�8 .aevtodocnull  �    alis�7 0 process_item  �6 0 trimtext trimText�5 0 thefiles theFiles�4 (0 theannotationfiles theAnnotationFiles�3 0 thefilename theFileName�2 *0 destinationfilename destinationFileName�1 0 thedupe theDupe�0 0 thedupealias theDupeAlias�/  �.  �-  �,  �+  �*  3 �) �(�'=>�&
�) .aevtoappnull  �   � ****�(  �'  = �%�% 0 thefile theFile> �$ �#�"�!� ���� 3�� A D� F������� c���
�$ 
prmp
�# 
mlsl�" 
�! .sysostdfalis    ��� null�  0 thefiles theFiles� (0 theannotationfiles theAnnotationFiles
� 
kocl
� 
cobj
� .corecnte****       ****
� 
pnam� 0 thefilename theFileName� 0 trimtext trimText� *0 destinationfilename destinationFileName
� .coreclon****      � ****� 0 thedupe theDupe
� 
alis� 0 thedupealias theDupeAlias�  �  
� .sysodlogaskr        TEXT
� .ascrcmnt****      � ****� 0 process_item  �& �*���e� E�OjvE�O }�[��l 	kh  � ��,E�UO*���m+ a %E` O� 3 $�j E` O_ a &E` O_ _ �,FW X  a j UO�j O_ j O_ �6FOP[OY��O *�k+ W X  h4 � ���?@�
� .aevtodocnull  �    alis� 0 these_items  �  ? �
�
 0 these_items  @ �	���	 0 process_item  �  �  �  *�k+  W X  h5 � ���AB�� 0 process_item  � �C� C  �� 0 	this_item  �  A � ���  0 	this_item  �� 0 mypath myPathB 	 ��� �������������
�� .earsffdralis        afdr
�� .miscactvnull��� ��� null
�� .sysodelanull��� ��� nmbr
�� 
PATH
�� .PRFLPRFL****      � ****��  ��  � 5 -� 	)j E�UOkn� *j Okj O��l UoW X  h6 �� �����DE���� 0 trimtext trimText�� ��F�� F  �������� 0 thetext theText�� *0 thecharacterstotrim theCharactersToTrim�� $0 thetrimdirection theTrimDirection��  D ���������� 0 thetext theText�� *0 thecharacterstotrim theCharactersToTrim�� $0 thetrimdirection theTrimDirection�� 0 thetrimlength theTrimLengthE �� � ���������,
�� 
leng
�� 
cha 
�� 
TEXT��  ��  �� |��,E�O��lv� 0 *h�� �[�\[Z�k\Zi2�&E�W 	X  �[OY��Y hO��lv� 1 +h�� �[�\[Zk\Z�k'2�&E�W 	X  �[OY��Y hO�7 ��G�� G  HHZalis    V   Macintosh HD               �/4�H+  �1c 1 (dragged).pdf                                               �6�Ֆ�I        ����  I                 �/�Y      ՗[�    "    1   ( d r a g g e d ) . p d f    M a c i n t o s h   H D  KUsers/lucas/Desktop/Test Project Template/Assets/PDF Pages/ 1 (dragged).pdf   /    ��      8 ��I�� I  <������������������������������<�alis    �   Macintosh HD               �/4�H+  �1c 1 (dragged) copy.pdf                                          �8/Ֆ�I        ����  	                	PDF Pages     �/�Y      ՗[�    �1c�1\�1Z 
� 
�) `�  cMacintosh HD:Users: lucas: Desktop: Test Project Template: Assets: PDF Pages:  1 (dragged) copy.pdf   ,    1   ( d r a g g e d )   c o p y . p d f    M a c i n t o s h   H D  PUsers/lucas/Desktop/Test Project Template/Assets/PDF Pages/ 1 (dragged) copy.pdf  /    ��  ��  ��  ��  ��  ��  ��  ��  ��  ��  ��  ��  ��  ��  ��  ��  9 �JJ     1   ( d r a g g e d ) . p d f: �KK ,   1   ( d r a g g e d ) _ a n n o t . p d f; LL M��NM O��PO Q��RQ S��TS U��VU W��XW Y��ZY  3��
�� 
sdsk
�� 
cfolZ �[[ 
 U s e r s
�� 
cfolX �\\ 
 l u c a s
�� 
cfolV �]]  D e s k t o p
�� 
cfolT �^^ * T e s t   P r o j e c t   T e m p l a t e
�� 
cfolR �__  A s s e t s
�� 
cfolP �``  P D F   P a g e s
�� 
docfN �aa *   1   ( d r a g g e d )   c o p y . p d f�?  �>  �=  �<  �;  �:  ascr  ��ޭ