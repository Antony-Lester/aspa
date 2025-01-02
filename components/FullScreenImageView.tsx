import React from 'react';
import { View, Image, TouchableOpacity, Modal, Text } from 'react-native';
import useStyles from '../styles'; // Use styles
import { useTheme } from '../ThemeContext'; // Import useTheme

interface FullScreenImageViewProps {
  visible: boolean;
  imageUri: string;
  onClose: () => void;
  onDelete: () => void;
}

const FullScreenImageView: React.FC<FullScreenImageViewProps> = ({
  visible,
  imageUri,
  onClose,
  onDelete,
}) => {
  const { colors } = useTheme(); // Use theme colors
  const styles = useStyles(); // Use styles

  return (
    <Modal
      visible={visible}
      transparent={false}
      onRequestClose={onClose}>
      <TouchableOpacity style={styles.fullScreenContainer} onPress={onClose}>
        <Image
          source={{ uri: imageUri }}
          style={styles.fullScreenImage}
          resizeMode="contain"
        />
        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default FullScreenImageView;